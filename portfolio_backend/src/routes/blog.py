from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.blog import BlogPost
import json
from datetime import datetime

blog_bp = Blueprint('blog', __name__)

@blog_bp.route('/blog/posts', methods=['GET'])
def get_blog_posts():
    """Get all blog posts with optional filtering"""
    try:
        # Get query parameters
        category = request.args.get('category')
        featured = request.args.get('featured')
        published = request.args.get('published', 'true')
        limit = request.args.get('limit', type=int)
        
        # Build query
        query = BlogPost.query
        
        if category:
            query = query.filter(BlogPost.category == category)
        
        if featured is not None:
            featured_bool = featured.lower() == 'true'
            query = query.filter(BlogPost.featured == featured_bool)
        
        if published is not None:
            published_bool = published.lower() == 'true'
            query = query.filter(BlogPost.published == published_bool)
        
        # Order by publication date (newest first)
        query = query.order_by(BlogPost.published_at.desc().nullslast(), BlogPost.created_at.desc())
        
        if limit:
            query = query.limit(limit)
        
        posts = query.all()
        
        return jsonify({
            'success': True,
            'data': [post.to_dict() for post in posts],
            'count': len(posts)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@blog_bp.route('/blog/posts/<slug>', methods=['GET'])
def get_blog_post_by_slug(slug):
    """Get a specific blog post by slug"""
    try:
        post = BlogPost.query.filter_by(slug=slug).first_or_404()
        
        # Increment view count
        post.views += 1
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': post.to_dict()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@blog_bp.route('/blog/posts/<int:post_id>', methods=['GET'])
def get_blog_post(post_id):
    """Get a specific blog post by ID"""
    try:
        post = BlogPost.query.get_or_404(post_id)
        return jsonify({
            'success': True,
            'data': post.to_dict()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@blog_bp.route('/blog/posts', methods=['POST'])
def create_blog_post():
    """Create a new blog post"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'slug', 'content', 'category']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Check if slug already exists
        existing_post = BlogPost.query.filter_by(slug=data['slug']).first()
        if existing_post:
            return jsonify({
                'success': False,
                'error': 'A post with this slug already exists'
            }), 400
        
        # Calculate reading time (rough estimate: 200 words per minute)
        word_count = len(data['content'].split())
        reading_time = max(1, round(word_count / 200))
        
        # Create new blog post
        post = BlogPost(
            title=data['title'],
            slug=data['slug'],
            content=data['content'],
            excerpt=data.get('excerpt'),
            category=data['category'],
            tags=json.dumps(data.get('tags', [])),
            featured_image=data.get('featured_image'),
            published=data.get('published', False),
            featured=data.get('featured', False),
            reading_time=reading_time,
            published_at=datetime.utcnow() if data.get('published', False) else None
        )
        
        db.session.add(post)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': post.to_dict(),
            'message': 'Blog post created successfully'
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@blog_bp.route('/blog/posts/<int:post_id>', methods=['PUT'])
def update_blog_post(post_id):
    """Update an existing blog post"""
    try:
        post = BlogPost.query.get_or_404(post_id)
        data = request.get_json()
        
        # Update fields if provided
        if 'title' in data:
            post.title = data['title']
        if 'slug' in data and data['slug'] != post.slug:
            # Check if new slug already exists
            existing_post = BlogPost.query.filter_by(slug=data['slug']).first()
            if existing_post:
                return jsonify({
                    'success': False,
                    'error': 'A post with this slug already exists'
                }), 400
            post.slug = data['slug']
        if 'content' in data:
            post.content = data['content']
            # Recalculate reading time
            word_count = len(data['content'].split())
            post.reading_time = max(1, round(word_count / 200))
        if 'excerpt' in data:
            post.excerpt = data['excerpt']
        if 'category' in data:
            post.category = data['category']
        if 'tags' in data:
            post.tags = json.dumps(data['tags'])
        if 'featured_image' in data:
            post.featured_image = data['featured_image']
        if 'published' in data:
            post.published = data['published']
            if data['published'] and not post.published_at:
                post.published_at = datetime.utcnow()
        if 'featured' in data:
            post.featured = data['featured']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': post.to_dict(),
            'message': 'Blog post updated successfully'
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@blog_bp.route('/blog/posts/<int:post_id>', methods=['DELETE'])
def delete_blog_post(post_id):
    """Delete a blog post"""
    try:
        post = BlogPost.query.get_or_404(post_id)
        db.session.delete(post)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Blog post deleted successfully'
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@blog_bp.route('/blog/categories', methods=['GET'])
def get_blog_categories():
    """Get all unique blog categories"""
    try:
        categories = db.session.query(BlogPost.category).distinct().all()
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

