import os, pathlib

class Config(object):
    # сохранён оригинальный формат переменных окружения
    APPNAME = ''
    ROOT = (pathlib.Path(__file__).resolve().parent / APPNAME).as_posix()
    UPLOAD_PATH  = '/static/upload/'
    SERVER_PATH  = ROOT + UPLOAD_PATH

    USER = os.environ.get('POSTGRES_USER', 'blackcoder')
    PASSWORD = os.environ.get('POSTGRES_PASSWORD', '2846')
    HOST = os.environ.get('POSTGRES_HOST', '127.0.0.1')
    PORT = os.environ.get('POSTGRES_PORT', '5432')
    DB   = os.environ.get('POSTGRES_DB', 'bookdb')

    SQLALCHEMY_DATABASE_URI = (
        f'postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DB}'
    )
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-key')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

# import os, pathlib
# BASE_DIR = pathlib.Path(__file__).resolve().parent

# class Config:
#     SECRET_KEY = os.getenv("SECRET_KEY", "dev-key")
#     SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'app.db'}")
#     SQLALCHEMY_TRACK_MODIFICATIONS = False