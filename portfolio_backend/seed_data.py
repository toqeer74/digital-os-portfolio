#!/usr/bin/env python3
import os
import sys
import json
from datetime import datetime, timedelta

# Add the src directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.models.user import db
from src.models.project import Project
from src.models.blog import BlogPost
from src.models.product import Product
from src.models.message import Message
from src.models.analytics import PageView, Interaction
from src.main import app

def create_sample_projects():
    """Create sample portfolio projects"""
    projects = [
        {
            'title': 'AI-Powered Task Automation',
            'description': 'A comprehensive automation platform that uses machine learning to optimize workflow processes. Built with Python, TensorFlow, and React, this system can analyze user behavior patterns and automatically suggest process improvements.',
            'short_description': 'ML-powered automation platform for workflow optimization',
            'category': 'AI/ML',
            'tags': json.dumps(['Python', 'TensorFlow', 'React', 'Machine Learning', 'Automation']),
            'tech_stack': json.dumps(['Python', 'TensorFlow', 'React', 'PostgreSQL', 'Docker', 'AWS']),
            'image_url': '/src/assets/references/modern_os_interface.jpg',
            'demo_url': 'https://demo.toqeer.dev/ai-automation',
            'github_url': 'https://github.com/toqeer/ai-automation',
            'featured': True,
            'status': 'completed'
        },
        {
            'title': 'Digital OS Portfolio',
            'description': 'An innovative portfolio website designed as a complete operating system interface. Features draggable windows, a command palette, and a modern glassmorphism design. Built with React, Framer Motion, and Flask backend.',
            'short_description': 'OS-style portfolio with draggable windows and modern UI',
            'category': 'Web Development',
            'tags': json.dumps(['React', 'Flask', 'UI/UX', 'Portfolio', 'Innovation']),
            'tech_stack': json.dumps(['React', 'Flask', 'Framer Motion', 'Tailwind CSS', 'SQLite']),
            'image_url': '/src/assets/references/dark_ui_design.png',
            'demo_url': 'https://toqeer.dev',
            'github_url': 'https://github.com/toqeer/digital-os-portfolio',
            'featured': True,
            'status': 'in_progress'
        },
        {
            'title': 'E-commerce Analytics Dashboard',
            'description': 'Real-time analytics dashboard for e-commerce platforms with advanced data visualization, predictive analytics, and automated reporting. Integrates with multiple payment gateways and provides actionable business insights.',
            'short_description': 'Real-time e-commerce analytics with predictive insights',
            'category': 'Data Analytics',
            'tags': json.dumps(['Analytics', 'Dashboard', 'E-commerce', 'Data Visualization']),
            'tech_stack': json.dumps(['React', 'D3.js', 'Node.js', 'MongoDB', 'Redis', 'Stripe API']),
            'image_url': '/src/assets/backgrounds/tech_background_1.jpg',
            'demo_url': 'https://analytics.toqeer.dev',
            'github_url': 'https://github.com/toqeer/ecommerce-analytics',
            'featured': False,
            'status': 'completed'
        },
        {
            'title': 'Smart Home IoT Controller',
            'description': 'Centralized IoT device management system with voice control, automated scheduling, and energy optimization. Features a mobile app and web dashboard for complete home automation control.',
            'short_description': 'IoT home automation with voice control and energy optimization',
            'category': 'IoT',
            'tags': json.dumps(['IoT', 'Smart Home', 'Voice Control', 'Mobile App']),
            'tech_stack': json.dumps(['React Native', 'Node.js', 'MQTT', 'Raspberry Pi', 'Arduino']),
            'image_url': '/src/assets/backgrounds/tech_background_2.jpg',
            'demo_url': 'https://smarthome.toqeer.dev',
            'github_url': 'https://github.com/toqeer/smart-home-iot',
            'featured': False,
            'status': 'completed'
        },
        {
            'title': 'Blockchain Voting System',
            'description': 'Secure, transparent voting platform built on blockchain technology. Ensures vote integrity, provides real-time results, and maintains complete transparency while preserving voter anonymity.',
            'short_description': 'Secure blockchain-based voting with transparency and anonymity',
            'category': 'Blockchain',
            'tags': json.dumps(['Blockchain', 'Voting', 'Security', 'Transparency']),
            'tech_stack': json.dumps(['Solidity', 'Web3.js', 'React', 'Ethereum', 'IPFS']),
            'image_url': '/src/assets/backgrounds/developer_workspace.jpg',
            'demo_url': 'https://vote.toqeer.dev',
            'github_url': 'https://github.com/toqeer/blockchain-voting',
            'featured': True,
            'status': 'planning'
        }
    ]
    
    for project_data in projects:
        project = Project(**project_data)
        db.session.add(project)
    
    print(f"Created {len(projects)} sample projects")

def create_sample_blog_posts():
    """Create sample blog posts"""
    posts = [
        {
            'title': 'Building a Digital OS Portfolio: Lessons Learned',
            'slug': 'building-digital-os-portfolio-lessons-learned',
            'content': '''# Building a Digital OS Portfolio: Lessons Learned

Creating a portfolio that mimics an operating system interface was both challenging and rewarding. Here are the key insights I gained during development.

## The Vision

The idea was to create something unique - a portfolio that doesn't just showcase work, but provides an interactive experience that demonstrates technical skills through the interface itself.

## Technical Challenges

### Window Management
Implementing draggable, resizable windows required careful state management and performance optimization. Using React's useCallback and useMemo hooks was crucial for preventing unnecessary re-renders.

### Responsive Design
Making an OS-style interface work on mobile devices required creative solutions. The key was adapting the metaphor rather than abandoning it.

## Key Technologies

- **React** with Hooks for state management
- **Framer Motion** for smooth animations
- **Tailwind CSS** for styling
- **Flask** for the backend API

## Lessons Learned

1. **User Experience First**: Even innovative interfaces need to be intuitive
2. **Performance Matters**: Smooth animations are crucial for the illusion
3. **Progressive Enhancement**: Start with core functionality, add polish later

The result is a portfolio that not only showcases projects but demonstrates frontend development skills through its very existence.''',
            'excerpt': 'Insights and lessons from creating an innovative OS-style portfolio interface with React and modern web technologies.',
            'category': 'Development',
            'tags': json.dumps(['React', 'Portfolio', 'UI/UX', 'Web Development']),
            'featured_image': '/src/assets/references/modern_os_interface.jpg',
            'published': True,
            'featured': True,
            'reading_time': 5,
            'views': 1250,
            'published_at': datetime.utcnow() - timedelta(days=7)
        },
        {
            'title': 'The Future of AI in Web Development',
            'slug': 'future-ai-web-development',
            'content': '''# The Future of AI in Web Development

Artificial Intelligence is revolutionizing how we build web applications. From automated testing to intelligent code generation, AI tools are becoming indispensable.

## Current AI Tools

### Code Generation
- GitHub Copilot for intelligent code completion
- ChatGPT for problem-solving and debugging
- Tabnine for context-aware suggestions

### Design and UX
- Figma AI for design automation
- Adobe Sensei for intelligent design decisions
- Framer AI for responsive design generation

## Emerging Trends

1. **No-Code AI Platforms**: Enabling non-developers to build complex applications
2. **Intelligent Testing**: AI-powered test generation and bug detection
3. **Performance Optimization**: Automated code optimization and bundle analysis

## The Developer's Role

Rather than replacing developers, AI is augmenting our capabilities. The future developer will be more of an AI orchestrator, focusing on architecture and creative problem-solving.

## Conclusion

Embracing AI tools while maintaining core development skills is key to staying relevant in the evolving tech landscape.''',
            'excerpt': 'Exploring how AI is transforming web development and what it means for developers in 2024 and beyond.',
            'category': 'AI/ML',
            'tags': json.dumps(['AI', 'Web Development', 'Future Tech', 'Automation']),
            'featured_image': '/src/assets/references/dark_ui_design.png',
            'published': True,
            'featured': False,
            'reading_time': 8,
            'views': 890,
            'published_at': datetime.utcnow() - timedelta(days=14)
        },
        {
            'title': 'Mastering React Performance Optimization',
            'slug': 'mastering-react-performance-optimization',
            'content': '''# Mastering React Performance Optimization

Performance optimization in React applications is crucial for user experience. Here's a comprehensive guide to the most effective techniques.

## Core Optimization Techniques

### 1. Memoization
```javascript
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* expensive rendering */}</div>
})
```

### 2. useCallback and useMemo
```javascript
const memoizedCallback = useCallback(() => {
  doSomething(a, b)
}, [a, b])

const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
```

### 3. Code Splitting
```javascript
const LazyComponent = React.lazy(() => import('./LazyComponent'))
```

## Advanced Techniques

### Virtual Scrolling
For large lists, implement virtual scrolling to render only visible items.

### Bundle Analysis
Use webpack-bundle-analyzer to identify and eliminate unnecessary dependencies.

### Image Optimization
Implement lazy loading and use modern image formats like WebP.

## Measuring Performance

- React DevTools Profiler
- Chrome DevTools Performance tab
- Web Vitals metrics

## Best Practices

1. **Avoid Inline Objects**: Create objects outside render or use useMemo
2. **Optimize Re-renders**: Use React.memo strategically
3. **Lazy Load Components**: Split code at route level
4. **Optimize Images**: Use appropriate formats and sizes

Performance optimization is an ongoing process. Profile first, optimize second, and always measure the impact of your changes.''',
            'excerpt': 'A comprehensive guide to React performance optimization techniques, from basic memoization to advanced bundle splitting.',
            'category': 'Development',
            'tags': json.dumps(['React', 'Performance', 'Optimization', 'JavaScript']),
            'featured_image': '/src/assets/backgrounds/tech_background_1.jpg',
            'published': True,
            'featured': True,
            'reading_time': 12,
            'views': 2100,
            'published_at': datetime.utcnow() - timedelta(days=21)
        }
    ]
    
    for post_data in posts:
        post = BlogPost(**post_data)
        db.session.add(post)
    
    print(f"Created {len(posts)} sample blog posts")

def create_sample_products():
    """Create sample shop products"""
    products = [
        {
            'name': 'React Component Library',
            'description': 'A comprehensive collection of 50+ reusable React components with TypeScript support, Storybook documentation, and complete test coverage. Includes form components, data visualization, navigation, and layout components.',
            'short_description': '50+ professional React components with TypeScript and tests',
            'price': 49.99,
            'original_price': 79.99,
            'category': 'Components',
            'tags': json.dumps(['React', 'TypeScript', 'Components', 'Storybook']),
            'image_url': '/src/assets/references/modern_os_interface.jpg',
            'gallery_images': json.dumps([
                '/src/assets/references/dark_ui_design.png',
                '/src/assets/backgrounds/tech_background_1.jpg'
            ]),
            'download_url': 'https://downloads.toqeer.dev/react-components',
            'file_size': '15.2 MB',
            'file_format': 'ZIP',
            'featured': True,
            'active': True,
            'stock_quantity': -1,  # Unlimited
            'sales_count': 127,
            'stripe_price_id': 'price_react_components'
        },
        {
            'name': 'Full-Stack Starter Template',
            'description': 'Complete full-stack application template with React frontend, Node.js/Express backend, PostgreSQL database, authentication, testing setup, and deployment configurations for AWS and Vercel.',
            'short_description': 'Production-ready full-stack template with auth and deployment',
            'price': 89.99,
            'original_price': 129.99,
            'category': 'Templates',
            'tags': json.dumps(['Full-Stack', 'React', 'Node.js', 'PostgreSQL', 'Authentication']),
            'image_url': '/src/assets/backgrounds/tech_background_2.jpg',
            'gallery_images': json.dumps([
                '/src/assets/backgrounds/developer_workspace.jpg',
                '/src/assets/references/dark_ui_design.png'
            ]),
            'download_url': 'https://downloads.toqeer.dev/fullstack-template',
            'file_size': '45.8 MB',
            'file_format': 'ZIP',
            'featured': True,
            'active': True,
            'stock_quantity': -1,
            'sales_count': 89,
            'stripe_price_id': 'price_fullstack_template'
        },
        {
            'name': 'AI Integration Toolkit',
            'description': 'Ready-to-use AI integration components and utilities for adding ChatGPT, image generation, and text analysis to your applications. Includes React hooks, API wrappers, and example implementations.',
            'short_description': 'AI integration components for ChatGPT and image generation',
            'price': 69.99,
            'category': 'AI Tools',
            'tags': json.dumps(['AI', 'ChatGPT', 'Image Generation', 'React Hooks']),
            'image_url': '/src/assets/backgrounds/developer_workspace.jpg',
            'download_url': 'https://downloads.toqeer.dev/ai-toolkit',
            'file_size': '8.5 MB',
            'file_format': 'ZIP',
            'featured': False,
            'active': True,
            'stock_quantity': -1,
            'sales_count': 45,
            'stripe_price_id': 'price_ai_toolkit'
        },
        {
            'name': 'Dashboard UI Kit',
            'description': 'Modern dashboard UI kit with 30+ screens, dark/light themes, responsive design, and interactive components. Perfect for admin panels, analytics dashboards, and SaaS applications.',
            'short_description': 'Modern dashboard UI kit with 30+ screens and themes',
            'price': 39.99,
            'original_price': 59.99,
            'category': 'UI Kits',
            'tags': json.dumps(['Dashboard', 'UI Kit', 'Admin Panel', 'SaaS']),
            'image_url': '/src/assets/references/dark_ui_design.png',
            'download_url': 'https://downloads.toqeer.dev/dashboard-ui-kit',
            'file_size': '25.3 MB',
            'file_format': 'Figma + Code',
            'featured': True,
            'active': True,
            'stock_quantity': -1,
            'sales_count': 203,
            'stripe_price_id': 'price_dashboard_ui_kit'
        },
        {
            'name': 'E-commerce Boilerplate',
            'description': 'Complete e-commerce solution with product management, shopping cart, payment integration (Stripe), order management, and admin dashboard. Built with Next.js and Prisma.',
            'short_description': 'Complete e-commerce solution with Stripe and admin dashboard',
            'price': 149.99,
            'category': 'Templates',
            'tags': json.dumps(['E-commerce', 'Next.js', 'Stripe', 'Prisma', 'Admin Dashboard']),
            'image_url': '/src/assets/backgrounds/tech_background_1.jpg',
            'download_url': 'https://downloads.toqeer.dev/ecommerce-boilerplate',
            'file_size': '67.2 MB',
            'file_format': 'ZIP',
            'featured': False,
            'active': True,
            'stock_quantity': -1,
            'sales_count': 34,
            'stripe_price_id': 'price_ecommerce_boilerplate'
        }
    ]
    
    for product_data in products:
        product = Product(**product_data)
        db.session.add(product)
    
    print(f"Created {len(products)} sample products")

def create_sample_messages():
    """Create sample contact messages"""
    messages = [
        {
            'name': 'Sarah Johnson',
            'email': 'sarah.johnson@techcorp.com',
            'subject': 'Collaboration Opportunity',
            'message': 'Hi Toqeer, I came across your portfolio and I\'m impressed by your work on AI automation. We have a project that could benefit from your expertise. Would you be interested in discussing a potential collaboration?',
            'phone': '+1-555-0123',
            'company': 'TechCorp Solutions',
            'project_type': 'AI/ML Development',
            'budget_range': '$10,000 - $25,000',
            'status': 'new',
            'priority': 'high',
            'source': 'portfolio'
        },
        {
            'name': 'Michael Chen',
            'email': 'mike@startup.io',
            'subject': 'Full-Stack Development Inquiry',
            'message': 'We\'re a early-stage startup looking for a full-stack developer to help build our MVP. Your portfolio shows exactly the kind of modern, scalable solutions we need. Can we schedule a call?',
            'company': 'InnovateTech Startup',
            'project_type': 'Full-Stack Development',
            'budget_range': '$5,000 - $10,000',
            'status': 'read',
            'priority': 'medium',
            'source': 'referral'
        },
        {
            'name': 'Emily Rodriguez',
            'email': 'emily.r@designstudio.com',
            'subject': 'UI/UX Collaboration',
            'message': 'Love your Digital OS portfolio concept! We have a client who wants something similarly innovative. Would you be open to collaborating on the technical implementation?',
            'phone': '+1-555-0456',
            'company': 'Creative Design Studio',
            'project_type': 'Frontend Development',
            'budget_range': '$3,000 - $5,000',
            'status': 'replied',
            'priority': 'medium',
            'source': 'social_media'
        }
    ]
    
    for message_data in messages:
        message = Message(**message_data)
        db.session.add(message)
    
    print(f"Created {len(messages)} sample messages")

def create_sample_analytics():
    """Create sample analytics data"""
    # Create page views for the last 30 days
    base_date = datetime.utcnow() - timedelta(days=30)
    
    pages = [
        {'url': '/', 'title': 'Toqeer.dev - Digital OS Portfolio'},
        {'url': '/portfolio', 'title': 'Portfolio - Toqeer.dev'},
        {'url': '/blog', 'title': 'Blog - Toqeer.dev'},
        {'url': '/shop', 'title': 'Shop - Toqeer.dev'},
        {'url': '/contact', 'title': 'Contact - Toqeer.dev'}
    ]
    
    for day in range(30):
        current_date = base_date + timedelta(days=day)
        daily_views = 50 + (day * 2)  # Increasing trend
        
        for _ in range(daily_views):
            page = pages[day % len(pages)]
            page_view = PageView(
                page_url=page['url'],
                page_title=page['title'],
                referrer='https://google.com' if day % 3 == 0 else 'direct',
                user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                ip_address=f'192.168.1.{(day * 3) % 255}',
                device_type='desktop' if day % 2 == 0 else 'mobile',
                browser='Chrome',
                os='Windows' if day % 2 == 0 else 'iOS',
                country='US',
                city='New York',
                duration=120 + (day * 5),
                created_at=current_date
            )
            db.session.add(page_view)
    
    print("Created sample analytics data for 30 days")

def main():
    """Main function to seed the database"""
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Clear existing data
        db.session.query(Project).delete()
        db.session.query(BlogPost).delete()
        db.session.query(Product).delete()
        db.session.query(Message).delete()
        db.session.query(PageView).delete()
        db.session.query(Interaction).delete()
        
        # Create sample data
        create_sample_projects()
        create_sample_blog_posts()
        create_sample_products()
        create_sample_messages()
        create_sample_analytics()
        
        # Commit all changes
        db.session.commit()
        
        print("\n✅ Database seeded successfully!")
        print("Sample data created:")
        print(f"- {Project.query.count()} projects")
        print(f"- {BlogPost.query.count()} blog posts")
        print(f"- {Product.query.count()} products")
        print(f"- {Message.query.count()} messages")
        print(f"- {PageView.query.count()} page views")

if __name__ == '__main__':
    main()

