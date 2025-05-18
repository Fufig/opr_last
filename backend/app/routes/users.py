from flask import Blueprint, request, jsonify, g
from ..models.user import User
from ..extensions import db
from ..auth import login_required

bp = Blueprint('users', __name__, url_prefix='/api/users')

@bp.route('/<int:uid>', methods=['PUT'])
@login_required
def update(uid):
    if g.current_user.id != uid:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        # Обновляем только разрешенные поля
        allowed_fields = ['full_name', 'telegram']
        for field in allowed_fields:
            if field in data:
                setattr(g.current_user, field, data[field])
        
        db.session.commit()
        return jsonify(g.current_user.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400 