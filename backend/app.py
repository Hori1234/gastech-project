from flask import Flask
from .config import Config
from .api import register_api
from .plugins import db, api, ma, login, migrate


def create_app(config=Config):
    """
    Initializes the Flask app and Flask plugins.

    :param config: configuration for the flask application
    :type config: :class:`Config`
    :returns App: Flask application
    :rtype: :class:`Flask`
    """
    # Initialise app and configuration
    app = Flask(__name__)
    app.config.from_object(config)

    # Initialise flask plugins
    db.init_app(app)
    api.init_app(app)
    ma.init_app(app)
    login.init_app(app)
    migrate.init_app(app, db)
    register_api(api)

    return app
