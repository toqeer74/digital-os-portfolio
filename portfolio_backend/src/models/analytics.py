from src.models.user import db
from datetime import datetime

class PageView(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    page_url = db.Column(db.String(500), nullable=False)
    page_title = db.Column(db.String(200), nullable=True)
    referrer = db.Column(db.String(500), nullable=True)
    user_agent = db.Column(db.String(500), nullable=True)
    ip_address = db.Column(db.String(45), nullable=True)
    session_id = db.Column(db.String(100), nullable=True)
    device_type = db.Column(db.String(50), nullable=True)  # desktop, mobile, tablet
    browser = db.Column(db.String(50), nullable=True)
    os = db.Column(db.String(50), nullable=True)
    country = db.Column(db.String(100), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    duration = db.Column(db.Integer, nullable=True)  # time spent on page in seconds
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<PageView {self.page_url}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'page_url': self.page_url,
            'page_title': self.page_title,
            'referrer': self.referrer,
            'user_agent': self.user_agent,
            'ip_address': self.ip_address,
            'session_id': self.session_id,
            'device_type': self.device_type,
            'browser': self.browser,
            'os': self.os,
            'country': self.country,
            'city': self.city,
            'duration': self.duration,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Interaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_type = db.Column(db.String(100), nullable=False)  # click, scroll, hover, download
    element_id = db.Column(db.String(200), nullable=True)
    element_class = db.Column(db.String(200), nullable=True)
    element_text = db.Column(db.String(500), nullable=True)
    page_url = db.Column(db.String(500), nullable=False)
    session_id = db.Column(db.String(100), nullable=True)
    ip_address = db.Column(db.String(45), nullable=True)
    extra_data = db.Column(db.Text, nullable=True)  # JSON string for additional data
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Interaction {self.event_type}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'event_type': self.event_type,
            'element_id': self.element_id,
            'element_class': self.element_class,
            'element_text': self.element_text,
            'page_url': self.page_url,
            'session_id': self.session_id,
            'ip_address': self.ip_address,
            'extra_data': self.extra_data,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

