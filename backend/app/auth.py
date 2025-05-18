import base64
from functools import wraps
from flask import request, jsonify, g
from .models.user import User
from .extensions import bcrypt, db


def _decode_basic_header():
    """Возвращает (login, password) или (None, None)."""
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Basic "):
        return None, None
    try:
        decoded = base64.b64decode(auth.split(" ", 1)[1]).decode()
        return decoded.split(":", 1)
    except Exception:
        return None, None


def basic_auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        login, password = _decode_basic_header()
        if not login or not password:
            return jsonify({'error': 'Authentication required'}), 401
        
        user = User.query.filter_by(login=login).first()
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        g.current_user = user
        return f(*args, **kwargs)
    return decorated


def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        login, password = _decode_basic_header()
        if not login or not password:
            return jsonify({'error': 'Authentication required'}), 401
        
        user = User.query.filter_by(login=login).first()
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        g.current_user = user
        return f(*args, **kwargs)
    return decorated


def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        login, password = _decode_basic_header()
        if not login or not password:
            return jsonify({'error': 'Authentication required'}), 401
        
        user = User.query.filter_by(login=login).first()
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        if user.role != 'admin':
            return jsonify({'error': 'Admin privileges required'}), 403
        
        g.current_user = user
        return f(*args, **kwargs)
    return decorated


def role_required(role):
    def deco(fn):
        @wraps(fn)
        @basic_auth_required
        def inner(*a, **kw):
            if g.current_user.role != role:
                return jsonify({'error': 'Forbidden'}), 403
            return fn(*a, **kw)
        return inner
    return deco


def _unauthorized():
    return (
        jsonify(msg="Unauthorized"),
        401,
        {"WWW-Authenticate": "Basic realm=api"},
    )