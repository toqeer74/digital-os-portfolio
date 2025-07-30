from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.analytics import PageView, Interaction
from datetime import datetime, timedelta
from sqlalchemy import func, desc
import json

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/analytics/pageview', methods=['POST'])
def track_pageview():
    """Track a page view"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if 'page_url' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing required field: page_url'
            }), 400
        
        # Get client information
        ip_address = request.environ.get('HTTP_X_FORWARDED_FOR', request.environ.get('REMOTE_ADDR'))
        user_agent = request.headers.get('User-Agent')
        
        # Create page view record
        pageview = PageView(
            page_url=data['page_url'],
            page_title=data.get('page_title'),
            referrer=data.get('referrer'),
            user_agent=user_agent,
            ip_address=ip_address,
            session_id=data.get('session_id'),
            device_type=data.get('device_type'),
            browser=data.get('browser'),
            os=data.get('os'),
            country=data.get('country'),
            city=data.get('city'),
            duration=data.get('duration')
        )
        
        db.session.add(pageview)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Page view tracked successfully'
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@analytics_bp.route('/analytics/interaction', methods=['POST'])
def track_interaction():
    """Track a user interaction"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['event_type', 'page_url']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Get client information
        ip_address = request.environ.get('HTTP_X_FORWARDED_FOR', request.environ.get('REMOTE_ADDR'))
        
        # Create interaction record
        interaction = Interaction(
            event_type=data['event_type'],
            element_id=data.get('element_id'),
            element_class=data.get('element_class'),
            element_text=data.get('element_text'),
            page_url=data['page_url'],
            session_id=data.get('session_id'),
            ip_address=ip_address,
            extra_data=json.dumps(data.get('metadata', {}))
        )
        
        db.session.add(interaction)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Interaction tracked successfully'
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@analytics_bp.route('/analytics/dashboard', methods=['GET'])
def get_dashboard_stats():
    """Get dashboard analytics statistics"""
    try:
        # Get date range (default to last 30 days)
        days = request.args.get('days', 30, type=int)
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Total page views
        total_pageviews = PageView.query.filter(PageView.created_at >= start_date).count()
        
        # Unique visitors (based on IP address)
        unique_visitors = db.session.query(func.count(func.distinct(PageView.ip_address))).filter(
            PageView.created_at >= start_date
        ).scalar()
        
        # Most popular pages
        popular_pages = db.session.query(
            PageView.page_url,
            func.count(PageView.id).label('views')
        ).filter(
            PageView.created_at >= start_date
        ).group_by(PageView.page_url).order_by(desc('views')).limit(10).all()
        
        # Device types
        device_stats = db.session.query(
            PageView.device_type,
            func.count(PageView.id).label('count')
        ).filter(
            PageView.created_at >= start_date
        ).group_by(PageView.device_type).all()
        
        # Browser stats
        browser_stats = db.session.query(
            PageView.browser,
            func.count(PageView.id).label('count')
        ).filter(
            PageView.created_at >= start_date
        ).group_by(PageView.browser).limit(10).all()
        
        # Top referrers
        referrer_stats = db.session.query(
            PageView.referrer,
            func.count(PageView.id).label('count')
        ).filter(
            PageView.created_at >= start_date,
            PageView.referrer.isnot(None),
            PageView.referrer != ''
        ).group_by(PageView.referrer).order_by(desc('count')).limit(10).all()
        
        # Daily page views for the last 30 days
        daily_views = db.session.query(
            func.date(PageView.created_at).label('date'),
            func.count(PageView.id).label('views')
        ).filter(
            PageView.created_at >= start_date
        ).group_by(func.date(PageView.created_at)).order_by('date').all()
        
        # Top interactions
        top_interactions = db.session.query(
            Interaction.event_type,
            func.count(Interaction.id).label('count')
        ).filter(
            Interaction.created_at >= start_date
        ).group_by(Interaction.event_type).order_by(desc('count')).all()
        
        return jsonify({
            'success': True,
            'data': {
                'total_pageviews': total_pageviews,
                'unique_visitors': unique_visitors,
                'popular_pages': [{'url': page[0], 'views': page[1]} for page in popular_pages],
                'device_stats': [{'device': device[0], 'count': device[1]} for device in device_stats],
                'browser_stats': [{'browser': browser[0], 'count': browser[1]} for browser in browser_stats],
                'referrer_stats': [{'referrer': ref[0], 'count': ref[1]} for ref in referrer_stats],
                'daily_views': [{'date': str(day[0]), 'views': day[1]} for day in daily_views],
                'top_interactions': [{'event': event[0], 'count': event[1]} for event in top_interactions]
            }
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@analytics_bp.route('/analytics/pageviews', methods=['GET'])
def get_pageviews():
    """Get page view data with filtering"""
    try:
        # Get query parameters
        page_url = request.args.get('page_url')
        days = request.args.get('days', 30, type=int)
        limit = request.args.get('limit', type=int)
        
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Build query
        query = PageView.query.filter(PageView.created_at >= start_date)
        
        if page_url:
            query = query.filter(PageView.page_url == page_url)
        
        query = query.order_by(PageView.created_at.desc())
        
        if limit:
            query = query.limit(limit)
        
        pageviews = query.all()
        
        return jsonify({
            'success': True,
            'data': [pageview.to_dict() for pageview in pageviews],
            'count': len(pageviews)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@analytics_bp.route('/analytics/interactions', methods=['GET'])
def get_interactions():
    """Get interaction data with filtering"""
    try:
        # Get query parameters
        event_type = request.args.get('event_type')
        page_url = request.args.get('page_url')
        days = request.args.get('days', 30, type=int)
        limit = request.args.get('limit', type=int)
        
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Build query
        query = Interaction.query.filter(Interaction.created_at >= start_date)
        
        if event_type:
            query = query.filter(Interaction.event_type == event_type)
        
        if page_url:
            query = query.filter(Interaction.page_url == page_url)
        
        query = query.order_by(Interaction.created_at.desc())
        
        if limit:
            query = query.limit(limit)
        
        interactions = query.all()
        
        return jsonify({
            'success': True,
            'data': [interaction.to_dict() for interaction in interactions],
            'count': len(interactions)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

