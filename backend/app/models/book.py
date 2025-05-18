from datetime import datetime
from ..extensions import db
from enum import Enum

class Condition(Enum):
    NEW = 'new'
    GOOD = 'good'
    WORN = 'worn'

class Genre(Enum):
    FICTION = 'fiction'
    NON_FICTION = 'non-fiction'
    SCIENCE = 'science'
    FANTASY = 'fantasy'
    MYSTERY = 'mystery'
    ROMANCE = 'romance'
    BIOGRAPHY = 'biography'
    HISTORY = 'history'
    POETRY = 'poetry'
    CHILDREN = 'children'

class Language(Enum):
    RUSSIAN = 'russian'
    ENGLISH = 'english'
    GERMAN = 'german'
    FRENCH = 'french'
    SPANISH = 'spanish'
    CHINESE = 'chinese'
    JAPANESE = 'japanese'

class ExchangeType(Enum):
    TEMPORARY = 'temporary'
    PERMANENT = 'permanent'

class BookStatus(Enum):
    AVAILABLE = 'available'
    EXCHANGED = 'exchanged'

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), default=BookStatus.AVAILABLE.value)
    genre = db.Column(db.String(50))
    language = db.Column(db.String(50))
    pages = db.Column(db.Integer)
    exchange_type = db.Column(db.String(20))
    condition = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    exchanges = db.relationship('Exchange', back_populates='book', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'description': self.description,
            'owner_id': self.owner_id,
            'owner': self.owner.full_name if self.owner else None,
            'status': self.status,
            'genre': self.genre,
            'language': self.language,
            'pages': self.pages,
            'exchange_type': self.exchange_type,
            'condition': self.condition,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

    def to_dict_without_reviews(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'description': self.description,
            'owner_id': self.owner_id,
            'owner': self.owner.full_name if self.owner else None,
            'status': self.status,
            'genre': self.genre,
            'language': self.language,
            'pages': self.pages,
            'exchange_type': self.exchange_type,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }