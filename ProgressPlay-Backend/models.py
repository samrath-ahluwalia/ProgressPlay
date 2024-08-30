from datetime import datetime
from . import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(length=50), nullable=False, unique=True)
    username = db.Column(db.String(length=20), nullable=False, unique=True)
    password = db.Column(db.String(length=60), nullable=False)
    usertype = db.Column(db.String, nullable=False)
    score = db.Column(db.Integer, nullable=False, default=0)
    todoitems = db.relationship('Todoitems', cascade="all, delete", backref='user')
    image = db.relationship('Image', cascade="all, delete", backref='user')
    todolists = db.relationship('Todolists', cascade="all, delete", backref='user')

class Todoitems(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    date_completed = db.Column(db.DateTime)
    date_goal = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    list_id = db.Column(db.Integer, db.ForeignKey('todolists.id'))

class Todolists(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    list = db.relationship('Todoitems', cascade="all, delete", backref='todolists')
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f"Image(name={self.name}, file_path={self.file_path})"
