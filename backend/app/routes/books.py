from flask import Blueprint, request, jsonify, g
from ..models.book import Book, BookStatus, ExchangeType, Condition, Genre, Language
from ..extensions import db
from ..auth import login_required

bp = Blueprint('books', __name__, url_prefix='/api/books')

# ---------- список ----------
@bp.route('')
def list_books():
    genre = request.args.get('genre')
    language = request.args.get('language')
    owner_id = request.args.get('owner_id')
    status = request.args.get('status')
    exchange_type = request.args.get('exchange_type')
    condition = request.args.get('condition')

    query = Book.query
    if genre:
        query = query.filter_by(genre=genre)
    if language:
        query = query.filter_by(language=language)
    if owner_id and owner_id.isdigit():
        query = query.filter_by(owner_id=int(owner_id))
    if status:
        query = query.filter_by(status=status)
    if exchange_type:
        query = query.filter_by(exchange_type=exchange_type)
    if condition:
        query = query.filter_by(condition=condition)

    books = query.all()
    return jsonify([book.to_dict() for book in books])

# ---------- деталь ----------
@bp.route('/<int:bid>')
def detail(bid):
    book = Book.query.get_or_404(bid)
    return jsonify(book.to_dict())

# ---------- создание ----------
@bp.route('', methods=['POST'])
@login_required
def create():
    data = request.get_json()
    required_fields = ['title', 'author', 'genre', 'language', 'exchange_type']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Валидация значений enum
    if data.get('genre') and data['genre'] not in [g.value for g in Genre]:
        return jsonify({'error': 'Invalid genre'}), 400
    if data.get('language') and data['language'] not in [l.value for l in Language]:
        return jsonify({'error': 'Invalid language'}), 400
    if data.get('exchange_type') and data['exchange_type'] not in [e.value for e in ExchangeType]:
        return jsonify({'error': 'Invalid exchange type'}), 400
    if data.get('condition') and data['condition'] not in [c.value for c in Condition]:
        return jsonify({'error': 'Invalid condition'}), 400

    try:
        book = Book(
            title=data['title'],
            author=data['author'],
            description=data.get('description'),
            owner_id=g.current_user.id,
            status=BookStatus.AVAILABLE.value,
            genre=data['genre'],
            language=data['language'],
            pages=data.get('pages'),
            exchange_type=data['exchange_type'],
            condition=data.get('condition')
        )
        db.session.add(book)
        db.session.commit()
        return jsonify(book.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# ---------- обновление ----------
@bp.route('/<int:bid>', methods=['PUT'])
@login_required
def update(bid):
    book = Book.query.get_or_404(bid)
    if book.owner_id != g.current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    # Валидация значений enum
    if data.get('genre') and data['genre'] not in [g.value for g in Genre]:
        return jsonify({'error': 'Invalid genre'}), 400
    if data.get('language') and data['language'] not in [l.value for l in Language]:
        return jsonify({'error': 'Invalid language'}), 400
    if data.get('exchange_type') and data['exchange_type'] not in [e.value for e in ExchangeType]:
        return jsonify({'error': 'Invalid exchange type'}), 400
    if data.get('condition') and data['condition'] not in [c.value for c in Condition]:
        return jsonify({'error': 'Invalid condition'}), 400
    if data.get('status') and data['status'] not in [s.value for s in BookStatus]:
        return jsonify({'error': 'Invalid status'}), 400

    for field in ['title', 'author', 'description', 'status', 'genre', 'language', 'pages', 'exchange_type', 'condition']:
        if field in data:
            setattr(book, field, data[field])

    db.session.commit()
    return jsonify(book.to_dict())

# ---------- удаление ----------
@bp.route('/<int:bid>', methods=['DELETE'])
@login_required
def delete(bid):
    book = Book.query.get_or_404(bid)
    if book.owner_id != g.current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    try:
        # Удаляем все связанные обмены
        for exchange in book.exchanges:
            db.session.delete(exchange)
        
        # Удаляем книгу
        db.session.delete(book)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500