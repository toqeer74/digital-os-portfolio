from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.project import Project
import json

projects_bp = Blueprint('projects', __name__)

@projects_bp.route('/projects', methods=['GET'])
def get_projects():
    """Get all projects with optional filtering"""
    try:
        # Get query parameters
        category = request.args.get('category')
        featured = request.args.get('featured')
        status = request.args.get('status')
        limit = request.args.get('limit', type=int)
        
        # Build query
        query = Project.query
        
        if category:
            query = query.filter(Project.category == category)
        
        if featured is not None:
            featured_bool = featured.lower() == 'true'
            query = query.filter(Project.featured == featured_bool)
        
        if status:
            query = query.filter(Project.status == status)
        
        # Order by creation date (newest first)
        query = query.order_by(Project.created_at.desc())
        
        if limit:
            query = query.limit(limit)
        
        projects = query.all()
        
        return jsonify({
            'success': True,
            'data': [project.to_dict() for project in projects],
            'count': len(projects)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@projects_bp.route('/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    """Get a specific project by ID"""
    try:
        project = Project.query.get_or_404(project_id)
        return jsonify({
            'success': True,
            'data': project.to_dict()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@projects_bp.route('/projects', methods=['POST'])
def create_project():
    """Create a new project"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'description', 'category']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Create new project
        project = Project(
            title=data['title'],
            description=data['description'],
            short_description=data.get('short_description'),
            category=data['category'],
            tags=json.dumps(data.get('tags', [])),
            tech_stack=json.dumps(data.get('tech_stack', [])),
            image_url=data.get('image_url'),
            demo_url=data.get('demo_url'),
            github_url=data.get('github_url'),
            featured=data.get('featured', False),
            status=data.get('status', 'completed')
        )
        
        db.session.add(project)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': project.to_dict(),
            'message': 'Project created successfully'
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@projects_bp.route('/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    """Update an existing project"""
    try:
        project = Project.query.get_or_404(project_id)
        data = request.get_json()
        
        # Update fields if provided
        if 'title' in data:
            project.title = data['title']
        if 'description' in data:
            project.description = data['description']
        if 'short_description' in data:
            project.short_description = data['short_description']
        if 'category' in data:
            project.category = data['category']
        if 'tags' in data:
            project.tags = json.dumps(data['tags'])
        if 'tech_stack' in data:
            project.tech_stack = json.dumps(data['tech_stack'])
        if 'image_url' in data:
            project.image_url = data['image_url']
        if 'demo_url' in data:
            project.demo_url = data['demo_url']
        if 'github_url' in data:
            project.github_url = data['github_url']
        if 'featured' in data:
            project.featured = data['featured']
        if 'status' in data:
            project.status = data['status']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': project.to_dict(),
            'message': 'Project updated successfully'
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@projects_bp.route('/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    """Delete a project"""
    try:
        project = Project.query.get_or_404(project_id)
        db.session.delete(project)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Project deleted successfully'
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@projects_bp.route('/projects/categories', methods=['GET'])
def get_project_categories():
    """Get all unique project categories"""
    try:
        categories = db.session.query(Project.category).distinct().all()
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

