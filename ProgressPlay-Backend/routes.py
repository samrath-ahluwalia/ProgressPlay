import uuid
from flask import Blueprint, current_app, request, jsonify, render_template, send_file
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
from collections import defaultdict
from datetime import datetime
from .models import User, Todoitems, Todolists, Image
from . import db


routes = Blueprint('routes', __name__)

@routes.route('/')
def home():
    return render_template("index.html")

@routes.route('/userinfo/<username>', methods=['GET'])
@jwt_required()
def getuserinfo(username):
    user = User.query.filter_by(username=username).first()
    requesting_user = get_jwt_identity()
    if user.username != requesting_user:
        return jsonify({'message': "Access Denied"}), 403
    user_info = {'id': user.id, 'username': user.username, 'usertype': user.usertype, 'email': user.email, 'score': user.score}
    return user_info, 200

@routes.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    existing_user = User.query.filter_by(username=data['username']).first()
    if existing_user:
        return jsonify({'message': 'User already exists'}), 400

    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    new_user = User(username=data['username'], password=hashed_password, usertype="user", email=data['email'], score=0)
    db.session.add(new_user)
    db.session.commit()

    user = User.query.filter_by(username=data['username']).first()
    img = Image(name=user.username, file_path="default.png", user_id=user.id)
    db.session.add(img)
    db.session.commit()

    return jsonify({'message': 'Registered successfully'}), 200

@routes.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401

    userloggedin = {
        'userid': user.id,
        'email': user.email,
    }
    access_token = create_access_token(identity=user.username)
    return jsonify({'access_token': access_token, 'userinfo': userloggedin}), 200

@routes.route('/upload_image/<username>', methods=['POST'])
def upload_image(username):
    image = request.files.get("image")
    if image:
        filename = secure_filename(username + os.path.splitext(image.filename)[1])
        if os.path.splitext(filename)[1] not in current_app.config["UPLOAD_EXTENSIONS"]:
            return jsonify({"error": "File type not supported"}), 400
        upload_path = current_app.config["UPLOAD_PATH"]
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

@routes.route("/<username>/addlist", methods=['POST'])
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

@routes.route('/image/<username>', methods=['GET'])
def get_image(username):
    user = User.query.filter_by(username=username).first()
    image = Image.query.filter_by(user_id=user.id).first()
    profileimage = {
        "id": image.id,
        "name": image.name,
        "file_path": image.file_path,
        "user_id": image.user_id
    }
    return profileimage

@routes.route('/currentimage/<username>', methods=['GET'])
def currentimage(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    img = Image.query.filter_by(user_id=user.id).first()
    if not img or not img.file_path:
        return jsonify({"error": "Image not found"}), 404

    upload_path = current_app.config["UPLOAD_PATH"]
    image_path = os.path.join(upload_path, img.file_path)
    print(image_path)

    if not os.path.exists(image_path):
        return jsonify({"error": "File not found"}), 404

    return send_file(image_path, mimetype='image/jpeg')

@routes.route('/<username>/getalllists')
@jwt_required()
def getAllLists(username):
    user = User.query.filter_by(username=username).first()
    requesting_user = get_jwt_identity()
    if user.username != requesting_user:
        return jsonify({'message': "Access Denied"}), 403
    lists = Todolists.query.filter_by(user_id=user.id, is_deleted=False)
    todoLists = []
    sortedLists = sorted(lists, key=lambda s: s.date_created, reverse=True)
    for list in sortedLists:
        todoList = {
            'id': list.id,
            'name': list.name,
            'date_created': list.date_created,
            'user_id': list.user_id
        }
        todoLists.append(todoList)
    return todoLists

@routes.route('/<username>/getrecentlist')
@jwt_required()
def getRecentList(username):
    user = User.query.filter_by(username=username).first()
    lists = Todolists.query.filter_by(user_id=user.id)
    sortedLists = sorted(lists, key=lambda s: s.date_created, reverse=True)
    recentList = {
        'id': sortedLists[0].id,
        'name': sortedLists[0].name,
        'date_created': sortedLists[0].date_created,
        'user_id': sortedLists[0].user_id
    }
    return recentList

@routes.route('/<username>/changeEmail', methods=['POST'])
@jwt_required()
def changeEmail(username):
    user = User.query.filter_by(username=username).first()
    data = request.get_json()
    if data['email']:
        user2 = User.query.filter_by(email=data['email']).first()
        if not user2:
            user.email = data['email']
            db.session.commit()
            return jsonify({"message": "Email changed successfully"}), 200
    return jsonify({"message": "Account with this email already exists"}), 400

@routes.route('/<username>/getallitems')
@jwt_required()
def getAllItems(username):
    user = User.query.filter_by(username=username).first()
    items = Todoitems.query.filter_by(user_id=user.id, is_deleted=False).all()
    todoitems = []
    for item in items:
        todoitem = {
            'id': item.id,
            'title': item.title,
            'description': item.description,
            'date_created': item.date_created,
            'date_completed': item.date_completed,
            'date_goal': item.date_goal,
            'user_id': item.user_id,
            'list_id': item.list_id
        }
        todoitems.append(todoitem)
    return todoitems

@routes.route('/<username>/<listid>/getallitems')
@jwt_required()
def getListItems(username, listid):
    user = User.query.filter_by(username=username).first()
    items = Todoitems.query.filter_by(user_id=user.id, list_id=listid).all()
    todoitems = []
    for item in items:
        todoitem = {
            'id': item.id,
            'title': item.title,
            'description': item.description,
            'date_created': item.date_created,
            'date_completed': item.date_completed,
            'date_goal': item.date_goal,
            'user_id': item.user_id,
            'list_id': item.list_id
        }
        todoitems.append(todoitem)
    return todoitems

@routes.route('/<username>/<listid>/additem', methods=['POST'])
@jwt_required()
def additem(username, listid):
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

@routes.route('/<username>/<itemid>/deleteitem', methods=['POST'])
@jwt_required()
def deleteItem(username, itemid):
    user = User.query.filter_by(username = username).first()
    item = Todoitems.query.filter_by(user_id = user.id, id = itemid).first()
    item.is_deleted=True
    db.session.commit()
    return jsonify({}), 200

@routes.route('/<username>/<itemid>/completeitem', methods=['POST'])
@jwt_required()
def completeitem(username,itemid):
    item = Todoitems.query.get(itemid)
    item.date_completed = datetime.utcnow()
    db.session.commit()
    return jsonify({"message": "Task marked as complete!"}), 200

@routes.route('/<username>/editlist/<listid>', methods=['POST','PUT'])
@jwt_required()
def editList(username, listid):
    user = User.query.filter_by(username = username).first()
    list = Todolists.query.filter_by(user_id = user.id, id = listid).first()
    data = request.get_json()
    print(data)
    if 'name' in data:
        list.name = data['name']
        db.session.commit()
        return jsonify({}), 200
    else:
        return jsonify({}), 400

@routes.route('/<username>/getrecentlistitems')
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

@routes.route('/<username>/edititem/<itemid>', methods=['POST','PUT'])
@jwt_required()
def editItem(username, itemid):
    user = User.query.filter_by(username = username).first()
    item = Todoitems.query.filter_by(user_id = user.id, id = itemid).first()
    dataitem = request.get_json()
    if 'title' in dataitem:
        item.title = dataitem['title']
    if 'description' in dataitem:
        item.description = dataitem['description']
    if 'date_goal' in dataitem:
        item.date_goal = datetime.fromisoformat(dataitem['date_goal'])
    db.session.commit()
    return jsonify({}), 200

@routes.route('/<username>/<listid>/deletelist', methods=['POST'])
@jwt_required()
def deleteList(username, listid):
    user = User.query.filter_by(username = username).first()
    list = Todolists.query.filter_by(user_id = user.id, id = listid).first()
    items = Todoitems.query.filter_by(list_id = list.id).all()
    for item in items:
        item.is_deleted = True
    list.is_deleted = True
    db.session.commit()
    return jsonify({}), 200

@routes.route('/<username>/listcount', methods=['GET','POST'])
@jwt_required()
def listCount(username):
    user = User.query.filter_by(username = username).first()
    lists = Todolists.query.filter_by(user_id = user.id).all()
    grouped_lists = defaultdict(list)
    for list_item in lists:
        created_month = list_item.date_created.strftime('%Y-%m')
        grouped_lists[created_month].append({
            'id': list_item.id,
            'name': list_item.name,
            'date_created': list_item.date_created.strftime('%Y-%m-%d %H:%M:%S')
        })
    return jsonify(dict(grouped_lists)), 200

@routes.route('/<username>/deletedlists', methods=['GET','POST'])
@jwt_required()
def deletedLists(username):
    user = User.query.filter_by(username = username).first()
    lists = Todolists.query.filter_by(user_id = user.id, is_deleted = False).all()
    return lists
