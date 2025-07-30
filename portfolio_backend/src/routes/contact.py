from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.message import Message
from datetime import datetime

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/contact/messages', methods=['GET'])
def get_messages():
    """Get all contact messages with optional filtering"""
    try:
        # Get query parameters
        status = request.args.get('status')
        priority = request.args.get('priority')
        limit = request.args.get('limit', type=int)
        
        # Build query
        query = Message.query
        
        if status:
            query = query.filter(Message.status == status)
        
        if priority:
            query = query.filter(Message.priority == priority)
        
        # Order by creation date (newest first)
        query = query.order_by(Message.created_at.desc())
        
        if limit:
            query = query.limit(limit)
        
        messages = query.all()
        
        return jsonify({
            'success': True,
            'data': [message.to_dict() for message in messages],
            'count': len(messages)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@contact_bp.route('/contact/messages/<int:message_id>', methods=['GET'])
def get_message(message_id):
    """Get a specific message by ID"""
    try:
        message = Message.query.get_or_404(message_id)
        
        # Mark as read if not already read
        if message.status == 'new':
            message.status = 'read'
            message.read_at = datetime.utcnow()
            db.session.commit()
        
        return jsonify({
            'success': True,
            'data': message.to_dict()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@contact_bp.route('/contact/messages', methods=['POST'])
def create_message():
    """Create a new contact message"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'message']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Get client IP and user agent
        ip_address = request.environ.get('HTTP_X_FORWARDED_FOR', request.environ.get('REMOTE_ADDR'))
        user_agent = request.headers.get('User-Agent')
        
        # Create new message
        message = Message(
            name=data['name'],
            email=data['email'],
            subject=data.get('subject'),
            message=data['message'],
            phone=data.get('phone'),
            company=data.get('company'),
            project_type=data.get('project_type'),
            budget_range=data.get('budget_range'),
            priority=data.get('priority', 'normal'),
            source=data.get('source', 'contact_form'),
            ip_address=ip_address,
            user_agent=user_agent
        )
        
        db.session.add(message)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': message.to_dict(),
            'message': 'Message sent successfully'
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@contact_bp.route('/contact/messages/<int:message_id>', methods=['PUT'])
def update_message(message_id):
    """Update message status or priority"""
    try:
        message = Message.query.get_or_404(message_id)
        data = request.get_json()
        
        # Update fields if provided
        if 'status' in data:
            message.status = data['status']
            if data['status'] == 'replied' and not message.replied_at:
                message.replied_at = datetime.utcnow()
        
        if 'priority' in data:
            message.priority = data['priority']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': message.to_dict(),
            'message': 'Message updated successfully'
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@contact_bp.route('/contact/messages/<int:message_id>', methods=['DELETE'])
def delete_message(message_id):
    """Delete a message"""
    try:
        message = Message.query.get_or_404(message_id)
        db.session.delete(message)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Message deleted successfully'
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@contact_bp.route('/contact/stats', methods=['GET'])
def get_contact_stats():
    """Get contact message statistics"""
    try:
        total_messages = Message.query.count()
        new_messages = Message.query.filter_by(status='new').count()
        read_messages = Message.query.filter_by(status='read').count()
        replied_messages = Message.query.filter_by(status='replied').count()
        
        # Get messages by priority
        high_priority = Message.query.filter_by(priority='high').count()
        urgent_priority = Message.query.filter_by(priority='urgent').count()
        
        return jsonify({
            'success': True,
            'data': {
                'total_messages': total_messages,
                'new_messages': new_messages,
                'read_messages': read_messages,
                'replied_messages': replied_messages,
                'high_priority': high_priority,
                'urgent_priority': urgent_priority
            }
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

