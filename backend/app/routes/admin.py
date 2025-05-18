from flask import Blueprint, jsonify
from ..models.user import User
from ..auth import role_required

bp = Blueprint("admin", __name__, url_prefix="/api/admin")

@bp.route("/users")
@role_required("admin")
def list_users():
    return jsonify([
        {
            "id": u.id,
            "login": u.login,
            "full_name": u.full_name,
            "telegram": u.telegram,
            "role": u.role
        }
        for u in User.query.all()
    ])