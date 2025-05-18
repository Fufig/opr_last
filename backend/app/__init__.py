from flask import Flask, jsonify
from .config import Config
from .extensions import db, migrate, bcrypt
from .routes import auth as auth_routes, admin as admin_routes, books as books_routes, exchanges as exchanges_routes, users as users_routes
from flask_cors import CORS


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)

    CORS(app, 
         resources={r"/api/*": {
             "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
             "supports_credentials": True,
             "allow_credentials": True,
             "allow_headers": ["Content-Type", "Authorization"],
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
         }},
         expose_headers=["Content-Type", "Authorization"])

    app.register_blueprint(auth_routes.bp)
    app.register_blueprint(admin_routes.bp)
    app.register_blueprint(books_routes.bp)
    app.register_blueprint(exchanges_routes.bp)
    app.register_blueprint(users_routes.bp)

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'error': 'Bad request'}), 400

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({'error': 'Unauthorized'}), 401

    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({'error': 'Forbidden'}), 403

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

    return app