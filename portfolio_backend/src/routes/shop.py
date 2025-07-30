from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.product import Product
import json

shop_bp = Blueprint('shop', __name__)

@shop_bp.route('/shop/products', methods=['GET'])
def get_products():
    """Get all products with optional filtering"""
    try:
        # Get query parameters
        category = request.args.get('category')
        featured = request.args.get('featured')
        active = request.args.get('active', 'true')
        limit = request.args.get('limit', type=int)
        sort_by = request.args.get('sort_by', 'created_at')  # created_at, price, sales_count
        order = request.args.get('order', 'desc')  # asc, desc
        
        # Build query
        query = Product.query
        
        if category:
            query = query.filter(Product.category == category)
        
        if featured is not None:
            featured_bool = featured.lower() == 'true'
            query = query.filter(Product.featured == featured_bool)
        
        if active is not None:
            active_bool = active.lower() == 'true'
            query = query.filter(Product.active == active_bool)
        
        # Apply sorting
        if sort_by == 'price':
            if order == 'asc':
                query = query.order_by(Product.price.asc())
            else:
                query = query.order_by(Product.price.desc())
        elif sort_by == 'sales_count':
            if order == 'asc':
                query = query.order_by(Product.sales_count.asc())
            else:
                query = query.order_by(Product.sales_count.desc())
        else:  # created_at
            if order == 'asc':
                query = query.order_by(Product.created_at.asc())
            else:
                query = query.order_by(Product.created_at.desc())
        
        if limit:
            query = query.limit(limit)
        
        products = query.all()
        
        return jsonify({
            'success': True,
            'data': [product.to_dict() for product in products],
            'count': len(products)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@shop_bp.route('/shop/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get a specific product by ID"""
    try:
        product = Product.query.get_or_404(product_id)
        return jsonify({
            'success': True,
            'data': product.to_dict()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@shop_bp.route('/shop/products', methods=['POST'])
def create_product():
    """Create a new product"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'description', 'price', 'category']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Create new product
        product = Product(
            name=data['name'],
            description=data['description'],
            short_description=data.get('short_description'),
            price=data['price'],
            original_price=data.get('original_price'),
            category=data['category'],
            tags=json.dumps(data.get('tags', [])),
            image_url=data.get('image_url'),
            gallery_images=json.dumps(data.get('gallery_images', [])),
            download_url=data.get('download_url'),
            file_size=data.get('file_size'),
            file_format=data.get('file_format'),
            featured=data.get('featured', False),
            active=data.get('active', True),
            stock_quantity=data.get('stock_quantity', -1),  # -1 for unlimited digital products
            stripe_price_id=data.get('stripe_price_id')
        )
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': product.to_dict(),
            'message': 'Product created successfully'
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@shop_bp.route('/shop/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """Update an existing product"""
    try:
        product = Product.query.get_or_404(product_id)
        data = request.get_json()
        
        # Update fields if provided
        if 'name' in data:
            product.name = data['name']
        if 'description' in data:
            product.description = data['description']
        if 'short_description' in data:
            product.short_description = data['short_description']
        if 'price' in data:
            product.price = data['price']
        if 'original_price' in data:
            product.original_price = data['original_price']
        if 'category' in data:
            product.category = data['category']
        if 'tags' in data:
            product.tags = json.dumps(data['tags'])
        if 'image_url' in data:
            product.image_url = data['image_url']
        if 'gallery_images' in data:
            product.gallery_images = json.dumps(data['gallery_images'])
        if 'download_url' in data:
            product.download_url = data['download_url']
        if 'file_size' in data:
            product.file_size = data['file_size']
        if 'file_format' in data:
            product.file_format = data['file_format']
        if 'featured' in data:
            product.featured = data['featured']
        if 'active' in data:
            product.active = data['active']
        if 'stock_quantity' in data:
            product.stock_quantity = data['stock_quantity']
        if 'stripe_price_id' in data:
            product.stripe_price_id = data['stripe_price_id']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': product.to_dict(),
            'message': 'Product updated successfully'
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@shop_bp.route('/shop/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Delete a product"""
    try:
        product = Product.query.get_or_404(product_id)
        db.session.delete(product)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Product deleted successfully'
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@shop_bp.route('/shop/categories', methods=['GET'])
def get_product_categories():
    """Get all unique product categories"""
    try:
        categories = db.session.query(Product.category).distinct().all()
        category_list = [cat[0] for cat in categories if cat[0]]
        
        return jsonify({
            'success': True,
            'data': category_list
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@shop_bp.route('/shop/products/<int:product_id>/purchase', methods=['POST'])
def record_purchase(product_id):
    """Record a product purchase (increment sales count)"""
    try:
        product = Product.query.get_or_404(product_id)
        
        # Increment sales count
        product.sales_count += 1
        
        # Decrease stock if not unlimited
        if product.stock_quantity > 0:
            product.stock_quantity -= 1
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': product.to_dict(),
            'message': 'Purchase recorded successfully'
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

