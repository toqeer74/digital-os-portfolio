from src.models.user import db
from datetime import datetime

class BlogPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(200), unique=True, nullable=False)
    content = db.Column(db.Text, nullable=False)
    excerpt = db.Column(db.String(500), nullable=True)
    category = db.Column(db.String(100), nullable=False)
    tags = db.Column(db.Text, nullable=True)  # JSON string of tags
    featured_image = db.Column(db.String(500), nullable=True)
    published = db.Column(db.Boolean, default=False)
    featured = db.Column(db.Boolean, default=False)
    reading_time = db.Column(db.Integer, nullable=True)  # in minutes
    views = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    published_at = db.Column(db.DateTime, nullable=True)
    
    def __repr__(self):
        return f'<BlogPost {self.title}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'content': self.content,
            'excerpt': self.excerpt,
            'category': self.category,
            'tags': self.tags,
            'featured_image': self.featured_image,
            'published': self.published,
            'featured': self.featured,
            'reading_time': self.reading_time,
            'views': self.views,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'published_at': self.published_at.isoformat() if self.published_at else None
        }

