from src.models.user import db
from datetime import datetime

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    short_description = db.Column(db.String(500), nullable=True)
    price = db.Column(db.Float, nullable=False)
    original_price = db.Column(db.Float, nullable=True)  # for discounts
    category = db.Column(db.String(100), nullable=False)
    tags = db.Column(db.Text, nullable=True)  # JSON string of tags
    image_url = db.Column(db.String(500), nullable=True)
    gallery_images = db.Column(db.Text, nullable=True)  # JSON string of image URLs
    download_url = db.Column(db.String(500), nullable=True)  # for digital products
    file_size = db.Column(db.String(50), nullable=True)
    file_format = db.Column(db.String(50), nullable=True)
    featured = db.Column(db.Boolean, default=False)
    active = db.Column(db.Boolean, default=True)
    stock_quantity = db.Column(db.Integer, default=0)  # -1 for unlimited digital products
    sales_count = db.Column(db.Integer, default=0)
    stripe_price_id = db.Column(db.String(200), nullable=True)  # Stripe price ID
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Product {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'short_description': self.short_description,
            'price': self.price,
            'original_price': self.original_price,
            'category': self.category,
            'tags': self.tags,
            'image_url': self.image_url,
            'gallery_images': self.gallery_images,
            'download_url': self.download_url,
            'file_size': self.file_size,
            'file_format': self.file_format,
            'featured': self.featured,
            'active': self.active,
            'stock_quantity': self.stock_quantity,
            'sales_count': self.sales_count,
            'stripe_price_id': self.stripe_price_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

