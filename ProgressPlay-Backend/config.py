import os

class Config:
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    UPLOAD_EXTENSIONS = [".jpg", ".png", ".gif", ".jpeg"]
    UPLOAD_PATH = os.path.join(BASE_DIR, 'media')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'
    JWT_SECRET_KEY = "flaskappsecretkey"
    JSON_COMPACT = False