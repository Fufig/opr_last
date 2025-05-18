import os, secrets
from PIL import Image
from flask import current_app

ALLOWED = {'.jpg', '.jpeg', '.png', '.webp'}

def save_cover(file_storage):
    ext = os.path.splitext(file_storage.filename)[1].lower()
    if ext not in ALLOWED:
        raise ValueError('unsupported format')
    name = secrets.token_hex(8) + ext
    path = os.path.join(current_app.config['SERVER_PATH'], name)
    Image.open(file_storage).save(path, quality=90)
    return name