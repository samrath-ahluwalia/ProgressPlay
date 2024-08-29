from flask import Flask, render_template, request, jsonify, send_file, session, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_restful import Api, Resource
import os
import imghdr
import uuid
from werkzeug.utils import secure_filename
from sqlalchemy import MetaData
from flask_cors import CORS

app=Flask(__name__)

app.config["UPLOAD_EXTENSIONS"] = [".jpg", ".png", ".gif", ".jpeg"]
app.config["UPLOAD_PATH"] = "static/images"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['JWT_SECRET_KEY']= "flaskappsecretkey"
app.json.compact = False

db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(length = 50), nullable = False, unique= True)
    username = db.Column(db.String(length = 20), nullable = False, unique= True)
    password = db.Column(db.String(length = 60), nullable = False, unique= True)
    usertype = db.Column(db.String, nullable = False)
    score = db.Column(db.Integer, nullable = False, default = 0)
    todoitems = db.relationship('Todoitems',cascade="all, delete", backref='user')
    image = db.relationship('Image',cascade="all, delete", backref = "user")
    todolists = db.relationship('Todolists',cascade="all, delete", backref = 'user')

class Todoitems(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable = False)
    description = db.Column(db.String, nullable = False)
    date_created = db.Column(db.DateTime, nullable = False, default=datetime.utcnow)
    date_completed = db.Column(db.DateTime)
    date_goal = db.Column(db.DateTime, nullable = False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    list_id = db.Column(db.Integer, db.ForeignKey('todolists.id'))
    

class Todolists(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable = False)
    date_created = db.Column(db.DateTime, nullable = False, default=datetime.utcnow)
    list = db.relationship('Todoitems',cascade="all, delete", backref = 'todolists')
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    def __repr__(self):
        return f"Image(name={self.name}, file_path={self.file_path})"


@app.route('/')
def home():
    return render_template("index.html")

@app.route('/userinfo/<username>', methods=['GET'])
@jwt_required()
def getuserinfo(username):
    user = User.query.filter_by(username=username).first()
    requesting_user = get_jwt_identity()
    if user.username != requesting_user:
        return jsonify({'message':"Access Denied"}), 403
    user_info = {'id':user.id,'username':user.username,'usertype':user.usertype, 'email':user.email, 'score':user.score}
    return user_info, 200

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    existing_user = User.query.filter_by(username=data['username']).first()
    if existing_user:
        return jsonify({'message': 'User already exists'}), 400

    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    new_user = User(username=data['username'], password=hashed_password, usertype="user", email=data['email'], score = 0)
    db.session.add(new_user)
    db.session.commit()

    user = User.query.filter_by(username = data['username']).first()
    img = Image(name=user.username, file_path="default.png", user_id=user.id)
    db.session.add(img)
    db.session.commit()

    return jsonify({'message': 'Registered successfully'}), 200


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print("here is data: ",data)
    user = User.query.filter_by(username=data['username']).first()
    if not user or not check_password_hash(user.password, data['password']):
        if(not user):
            print("not user")
        elif not check_password_hash(user.password, data['password']):
            print("pw")
        return jsonify({'message': 'invalid credentials'}), 401
    userloggedin = {
        'userid':user.id,
        'email':user.email,
    }
    access_token = create_access_token(identity=user.username)
    return jsonify({'access_token': access_token, 'userinfo':userloggedin}), 200

@app.route('/upload_image/<username>', methods=['POST'])
def upload_image(username):
    image = request.files.get("image")
    if image:
        filename = secure_filename(username + os.path.splitext(image.filename)[1])
        if os.path.splitext(filename)[1] not in app.config["UPLOAD_EXTENSIONS"]:
            return jsonify({"error": "File type not supported"}), 400
        upload_path = app.config["UPLOAD_PATH"]
        full_path = os.path.join(upload_path, filename)
        if os.path.isfile(full_path):
            os.remove(full_path)
        image.save(full_path)
        user = User.query.filter_by(username=username).first()
        img = Image.query.filter_by(user_id=user.id).first()
        if img:
            img.name = username
            img.file_path = filename
        else:
            img = Image(name=username, file_path=filename, user_id=user.id)
            db.session.add(img)
        db.session.commit()
        return jsonify({"message": "Image uploaded successfully"}), 200
    else:
        return jsonify({"error": "No file selected"}), 400



@app.route('/image/<username>', methods=['GET'])
def get_image(username):
    user = User.query.filter_by(username = username).first()
    image = Image.query.filter_by(user_id = user.id).first()
    profileimage = {
        "id": image.id,
        "name": image.name,
        "file_path": image.file_path,
        "user_id":image.user_id
    }
    return profileimage

@app.route('/<username>/getalllists')
@jwt_required()
def getAllLists(username):
    user = User.query.filter_by(username = username).first()
    requesting_user = get_jwt_identity()
    if user.username != requesting_user:
        return jsonify({'message':"Access Denied"}), 403
    lists = Todolists.query.filter_by(user_id = user.id)
    todoLists = []
    sortedLists = sorted(lists, key=lambda s: s.date_created,reverse=True)
    for list in sortedLists:
        todoList = {
            'id' : list.id,
            'name': list.name,
            'date_created': list.date_created,
            'user_id': list.user_id
        }
        todoLists.append(todoList)
    print(todoLists)
    return todoLists

@app.route('/<username>/getrecentlist')
@jwt_required()
def getRecentList(username):
    user = User.query.filter_by(username = username).first()
    lists = Todolists.query.filter_by(user_id = user.id)
    sortedLists = sorted(lists, key=lambda s: s.date_created, reverse=True)
    recentList = {
        'id' : sortedLists[0].id,
        'name': sortedLists[0].name,
        'date_created': sortedLists[0].date_created,
        'user_id': sortedLists[0].user_id
    }
    print(recentList)
    return recentList

@app.route('/<username>/changeEmail',methods=['POST'])
@jwt_required()
def changeEmail(username):
    user = User.query.filter_by(username = username).first()
    data = request.get_json()
    if(data['email']):
        user2 = User.query.filter_by(email=data['email']).first()
        if not user2:
            user.email = data['email']
            db.session.commit()
            return jsonify({"message": "Email changed successfully"}), 200
    return jsonify({"message": "Account with this email already exists"}), 400


@app.route('/<username>/getallitems')
@jwt_required()
def getAllItems(username):
    user = User.query.filter_by(username = username).first()
    items = Todoitems.query.filter_by(user_id = user.id).all()
    todoitems = []
    for item in items:
        todoitem = {
            'id': item.id,
            'title': item.title,
            'description': item.description,
            'date_created':item.date_created,
            'date_completed': item.date_completed,
            'date_goal': item.date_goal,
            'user_id': item.user_id,
            'list_id': item.list_id
        }
        todoitems.append(todoitem)
    return todoitems
    
@app.route('/<username>/<listid>/getallitems')
@jwt_required()
def getListItems(username, listid):
    user = User.query.filter_by(username = username).first()
    items = Todoitems.query.filter_by(user_id = user.id, list_id = listid).all()
    todoitems = []
    for item in items:
        todoitem = {
            'id': item.id,
            'title': item.title,
            'description': item.description,
            'date_created':item.date_created,
            'date_completed': item.date_completed,
            'date_goal': item.date_goal,
            'user_id': item.user_id,
            'list_id': item.list_id
        }
        todoitems.append(todoitem)
    return todoitems

@app.route('/<username>/getrecentlistitems')
@jwt_required()
def getRecentListItems(username):
    user = User.query.filter_by(username = username).first()
    lists = Todolists.query.filter_by(user_id = user.id)
    sortedLists = sorted(lists, key=lambda s: s.date_created, reverse=True)
    recentList = sortedLists[0]
    items = Todoitems.query.filter_by(user_id = user.id, list_id = recentList.id).all()
    todoitems = []
    for item in items:
        todoitem = {
            'id': item.id,
            'title': item.title,
            'description': item.description,
            'date_created':item.date_created,
            'date_completed': item.date_completed,
            'date_goal': item.date_goal,
            'user_id': item.user_id,
            'list_id': item.list_id
        }
        todoitems.append(todoitem)
    return todoitems



@app.route("/<username>/addlist", methods=['POST'])
@jwt_required()
def add_list(username):
    data = request.get_json()
    if 'name' in data:
        name = data['name']
        date_created = datetime.now()
        user = User.query.filter_by(username = username).first()
        todolist  = Todolists(name =  name, date_created = date_created, user_id = user.id)
        user.score+=5
        db.session.add(todolist)
        db.session.commit()
        return jsonify({}), 200
    else:
        return jsonify({}), 400


@app.route('/<username>/editlist/<listid>', methods=['POST','PUT'])
@jwt_required()
def editList(username, listid):
    user = User.query.filter_by(username = username).first()
    list = Todolists.query.filter_by(user_id = user.id, id = listid).first()
    data = request.get_json()
    if 'name' in data:
        list.name = data['name']
        db.session.commit()
        return jsonify({}), 200
    else:
        return jsonify({}), 400
    

@app.route('/<username>/<listid>/additem', methods=['POST'])
@jwt_required()
def addItem(username, listid):
    user = User.query.filter_by(username = username).first()
    data = request.get_json()
    if 'title' and 'description' and 'date_goal' in data:
        date = (data['date_goal'])
        item = Todoitems(
            title = data['title'],
            description = data['description'],
            date_created = datetime.utcnow(),
            date_completed = None,
            date_goal = datetime.fromisoformat(date),
            user_id = user.id,
            list_id = listid
        )
        db.session.add(item)
        db.session.commit()
        return jsonify({}), 200
    else:
        return jsonify({}), 400       

@app.route('/<username>/<itemid>/deleteitem', methods=['POST'])
@jwt_required()
def deleteItem(username, itemid):
    user = User.query.filter_by(username = username).first()
    item = Todoitems.query.filter_by(user_id = user.id, id = itemid).first()
    db.session.delete(item)
    db.session.commit()
    return jsonify({}), 200

@app.route('/<username>/<listid>/deletelist', methods=['POST'])
@jwt_required()
def deleteList(username, listid):
    user = User.query.filter_by(username = username).first()
    list = Todolists.query.filter_by(user_id = user.id, id = listid).first()
    db.session.delete(list)
    db.session.commit()
    return jsonify({}), 200

@app.route('/<username>/edititem/<itemid>', methods=['POST','PUT'])
@jwt_required()
def editItem(username, itemid):
    user = User.query.filter_by(username = username).first()
    item = Todoitems.query.filter_by(user_id = user.id, id = itemid).first()
    data = request.get_json()
    dataitem = data['item']
    if 'title' in dataitem:
        item.title = dataitem['title']
    if 'description' in dataitem:
        item.description = dataitem['description']
    if 'date_goal' in dataitem:
        item.date_goal = datetime.fromisoformat(dataitem['date_goal'])
    db.session.commit()
    return jsonify({}), 200

@app.route('/<username>/<itemid>/completeitem', methods=['POST','PUT'])
@jwt_required()
def completeItem(username, itemid):
    user = User.query.filter_by(username = username).first()
    item = Todoitems.query.filter_by(user_id = user.id, id = itemid).first()
    data = request.get_json()
    if 'date_completed' in data:
        item.date_completed = datetime.fromisoformat(data['date_completed'])
        user.score+=2
        db.session.commit()
        return jsonify({}), 200
    return jsonify({}), 400
    

if __name__ == '__main__':
    app.run(debug=True)