from src.models.user import db
from datetime import datetime

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(200), nullable=True)
    message = db.Column(db.Text, nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    company = db.Column(db.String(100), nullable=True)
    project_type = db.Column(db.String(100), nullable=True)
    budget_range = db.Column(db.String(50), nullable=True)
    status = db.Column(db.String(50), default='new')  # new, read, replied, archived
    priority = db.Column(db.String(20), default='normal')  # low, normal, high, urgent
    source = db.Column(db.String(50), default='contact_form')  # contact_form, chat, email
    ip_address = db.Column(db.String(45), nullable=True)
    user_agent = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    read_at = db.Column(db.DateTime, nullable=True)
    replied_at = db.Column(db.DateTime, nullable=True)
    
    def __repr__(self):
        return f'<Message from {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'subject': self.subject,
            'message': self.message,
            'phone': self.phone,
            'company': self.company,
            'project_type': self.project_type,
            'budget_range': self.budget_range,
            'status': self.status,
            'priority': self.priority,
            'source': self.source,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'read_at': self.read_at.isoformat() if self.read_at else None,
            'replied_at': self.replied_at.isoformat() if self.replied_at else None
        }

