from datetime import datetime
from ..extensions import db
from enum import Enum

class ExchangeStatus(Enum):
    PENDING = 'pending'
    APPROVED = 'approved'
    DECLINED = 'declined'
    COMPLETED = 'completed'
    CANCELLED = 'cancelled'

class Exchange(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    requester_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), default=ExchangeStatus.PENDING.value)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    book = db.relationship('Book', back_populates='exchanges', lazy=True)
    requester = db.relationship('User', backref='exchanges', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'book_id': self.book_id,
            'book': {
                'id': self.book.id,
                'title': self.book.title,
                'author': self.book.author,
                'owner_id': self.book.owner_id,
                'owner': self.book.owner.full_name if self.book.owner else None
            },
            'requester_id': self.requester_id,
            'requester': self.requester.full_name if self.requester else None,
            'status': self.status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        } 