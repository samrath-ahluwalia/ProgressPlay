import os

class Config:
    UPLOAD_EXTENSIONS = [".jpg", ".png", ".gif", ".jpeg"]
    UPLOAD_PATH = "media/images"
    SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'
    JWT_SECRET_KEY = "flaskappsecretkey"
    JSON_COMPACT = False
