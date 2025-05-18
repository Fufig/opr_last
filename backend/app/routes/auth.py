from flask import Blueprint, request, jsonify, g
from sqlalchemy.exc import IntegrityError
from ..extensions import db
from ..models.user import User
from ..auth import basic_auth_required

bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# -------- регистрация --------
@bp.route("/register", methods=["GET", "POST"])
def register():
    data = request.get_json() or {}
    if not all(k in data for k in ("login", "full_name", "telegram", "password")):
        return jsonify({"error": "login, full_name, telegram, password required"}), 400
    
    if len(data["password"]) < 6:
        return jsonify({"error": "password must be at least 6 characters long"}), 400
    
    try:
        user = User.create(
            login=data["login"],
            full_name=data["full_name"],
            telegram=data["telegram"],
            password=data["password"]
        )
        return jsonify({"msg": "registered", "id": user.id}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "login already exists"}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

# -------- проверка учётки --------
@bp.route("/login", methods=["GET", "POST"])
@basic_auth_required
def login():
    u = g.current_user
    return jsonify({
        "id": u.id,
        "login": u.login,
        "full_name": u.full_name,
        "telegram": u.telegram,
        "role": u.role
    })

# -------- current user --------
@bp.route("/me")
@basic_auth_required
def me():
    u = g.current_user
    return jsonify({
        "id": u.id,
        "login": u.login,
        "full_name": u.full_name,
        "telegram": u.telegram,
        "role": u.role
    })