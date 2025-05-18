from flask import Blueprint, request, jsonify, g
from ..models.exchange import Exchange, ExchangeStatus
from ..models.book import Book, BookStatus
from ..models.user import User
from ..extensions import db
from ..auth import login_required
from datetime import datetime

bp = Blueprint('exchanges', __name__, url_prefix='/api/exchanges')

# ---------- список обменов ----------
@bp.route('')
@login_required
def list_exchanges():
    status = request.args.get('status')
    user_id = request.args.get('user_id')
    query = Exchange.query.join(Book)
    
    # Показываем обмены где пользователь либо запрашивающий, либо владелец книги
    query = query.filter(
        (Exchange.requester_id == g.current_user.id) | 
        (Book.owner_id == g.current_user.id)
    )
    
    if status:
        query = query.filter_by(status=status)
    if user_id and user_id.isdigit():
        query = query.filter_by(requester_id=int(user_id))
    
    exchanges = query.all()
    return jsonify([exchange.to_dict() for exchange in exchanges])

# ---------- создание обмена ----------
@bp.route('', methods=['POST'])
@login_required
def create():
    data = request.get_json()
    if not data or 'book_id' not in data:
        return jsonify({'error': 'book_id required'}), 400
    
    book = Book.query.get(data['book_id'])
    if not book:
        return jsonify({'error': 'Book not found'}), 404
    
    if book.owner_id == g.current_user.id:
        return jsonify({'error': 'Cannot request your own book'}), 400
    
    if book.status != BookStatus.AVAILABLE.value:
        return jsonify({'error': 'Book is not available for exchange'}), 400
    
    # Проверяем, нет ли уже активного обмена для этой книги
    active_exchange = Exchange.query.filter_by(
        book_id=book.id,
        status=ExchangeStatus.PENDING.value
    ).first()
    
    if active_exchange:
        return jsonify({'error': 'Book already has a pending exchange request'}), 400
    
    try:
        exchange = Exchange(
            book_id=book.id,
            requester_id=g.current_user.id,
            status=ExchangeStatus.PENDING.value,
            notes=data.get('notes')
        )
        db.session.add(exchange)
        db.session.commit()
        return jsonify(exchange.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# ---------- обновление статуса обмена ----------
@bp.route('/<int:eid>', methods=['PUT'])
@login_required
def update(eid):
    exchange = Exchange.query.get_or_404(eid)
    book = Book.query.get(exchange.book_id)
    if not book:
        return jsonify({'error': 'Book not found'}), 404
    
    data = request.get_json()
    if not data or 'status' not in data:
        return jsonify({'error': 'status is required'}), 400
    
    try:
        new_status = ExchangeStatus(data['status'])
    except ValueError:
        return jsonify({'error': 'Invalid status'}), 400
    
    # Проверяем права на изменение статуса
    if new_status in [ExchangeStatus.APPROVED, ExchangeStatus.DECLINED]:
        if book.owner_id != g.current_user.id:
            return jsonify({'error': 'Only book owner can approve or decline exchange'}), 403
    elif new_status == ExchangeStatus.COMPLETED:
        if exchange.requester_id != g.current_user.id:
            return jsonify({'error': 'Only requester can mark exchange as completed'}), 403
    elif new_status == ExchangeStatus.CANCELLED:
        if exchange.requester_id != g.current_user.id:
            return jsonify({'error': 'Only requester can cancel exchange'}), 403
    
    try:
        # Обновляем статус обмена
        exchange.status = new_status.value
        
        # Обновляем статус книги
        if new_status == ExchangeStatus.APPROVED:
            book.status = BookStatus.EXCHANGED.value
        elif new_status in [ExchangeStatus.COMPLETED, ExchangeStatus.DECLINED, ExchangeStatus.CANCELLED]:
            book.status = BookStatus.AVAILABLE.value
        
        db.session.commit()
        return jsonify(exchange.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# ---------- удаление обмена ----------
@bp.route('/<int:eid>', methods=['DELETE'])
@login_required
def delete(eid):
    exchange = Exchange.query.get_or_404(eid)
    book = Book.query.get(exchange.book_id)
    if not book:
        return jsonify({'error': 'Book not found'}), 404
    
    if g.current_user.id not in [book.owner_id, exchange.requester_id]:
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Если обмен был одобрен, возвращаем книгу в доступное состояние
    if exchange.status == ExchangeStatus.APPROVED.value:
        book.status = BookStatus.AVAILABLE.value
    
    db.session.delete(exchange)
    db.session.commit()
    return '', 204 