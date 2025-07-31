from src.main import app, db
from src.models.user import User
from src.models.project import Project
from src.models.blog import BlogPost
from src.models.product import Product
from src.models.message import Message
from src.models.analytics import PageView, Interaction
from datetime import datetime

with app.app_context():
    # Clear existing data
    db.drop_all()
    db.create_all()

    # Create a user
    user = User(username='toqeer', email='toqeer@example.com')
    db.session.add(user)
    db.session.commit()

    # Create projects
    project1 = Project(
        title='Digital OS Portfolio',
        description='A creative portfolio website simulating a desktop operating system.',
        category='web',
        tags='["react", "flask", "tailwind", "framer-motion"]',
        image_url='/images/project1.jpg',
        demo_url='#',
        github_url='https://github.com/toqeer74/digital-os-portfolio',
        created_at=datetime.now()
    )
    project2 = Project(
        title='AI Chatbot Integration',
        description='Developed an AI-powered chatbot for customer support.',
        category='ai',
        tags='["python", "tensorflow", "nlp"]',
        image_url='/images/project2.jpg',
        demo_url='#',
        github_url='#',
        created_at=datetime.now()
    )
    project3 = Project(
        title='E-commerce Platform',
        description='Built a scalable e-commerce platform with secure payment processing.',
        category='web',
        tags='["nodejs", "express", "mongodb"]',
        image_url='/images/project3.jpg',
        demo_url='#',
        github_url='#',
        created_at=datetime.now()
    )
    db.session.add_all([project1, project2, project3])

    # Create blog posts
    blog_post1 = BlogPost(
        title='The Future of Web Development with AI',
        slug='the-future-of-web-development-with-ai',
        content='Exploring the integration of AI in modern web applications.',
        category='AI',
        published=True,
        published_at=datetime.now()
    )
    blog_post2 = BlogPost(
        title='Building Interactive UIs with React and Framer Motion',
        slug='building-interactive-uis-with-react-and-framer-motion',
        content='A deep dive into creating engaging user interfaces.',
        category='Frontend',
        published=True,
        published_at=datetime.now()
    )
    db.session.add_all([blog_post1, blog_post2])

    # Create products
    product1 = Product(
        name='React Component Library',
        description='A collection of reusable React components.',
        price=49.99,
        image_url='/images/product1.jpg',
        stock_quantity=100,
        category='software'
    )
    product2 = Product(
        name='Flask API Template',
        description='A boilerplate for building RESTful APIs with Flask.',
        price=29.99,
        image_url='/images/product2.jpg',
        stock_quantity=50,
        category='software'
    )
    db.session.add_all([product1, product2])

    db.session.commit()
    print('Database seeded successfully!')


