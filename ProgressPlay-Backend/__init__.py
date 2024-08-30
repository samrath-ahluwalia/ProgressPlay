from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from .config import Config

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)
    from .models import User, Todoitems, Todolists, Image

    with app.app_context():
        db.create_all()

    migrate.init_app(app, db)

    from .routes import routes as routes_bp
    app.register_blueprint(routes_bp)
    
    return app
