import pytest
import os
import json
from backend.app import db as _db
from backend.app import create_app
from backend.models import User
from backend.config import Config


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URI') or 'sqlite://'


@pytest.fixture(scope='session')
def app():
    """
    Creates a new Flask application for each test.

    :returns Iterator[Flask App] _app: The Flask application for the test
    """
    _app = create_app(TestingConfig)
    context = _app.app_context()
    context.push()

    yield _app

    context.pop()


@pytest.fixture
def client(app):
    """
    Creates a test client for each new Flask App.

    This client can be used for making requests
    to the endpoints of the Flask App.


    :param Flask App app: The Flask application for the test
    :returns client: testing client
    """
    return app.test_client()


@pytest.fixture(scope='module')
def db(app):
    """"
    Creates a database for the test.

    The location of the database is given in the config
    of the Flask app

    :param Flask App app: The Flask application for the test
    :returns Iterator[`SQLAlchemy`] db: ORM for the database
    """
    yield _db


@pytest.fixture(scope='module')
def setup_users(db):
    """
    Setup users for this module.

    :param db: The ORM object
    :type db: :class:`flask_sqlalchemy.SQLAlchemy`
    """

    db.create_all()

    user = User(username='Midas Bergveen',
                password='w8woord',
                role='administrator')
    db.session.add(user)
    user1 = User(username='Twan van Broekhoven',
                 password='SomethingClever',
                 role='view-only')
    db.session.add(user1)
    db.session.commit()

    yield

    db.session.close()
    db.drop_all()


@pytest.fixture
def login_admin(client):
    """
    Logs in an admin before each test.

    Client is recreated for each test, so the cookies should be set again.

    :param client: Flask test client
    :type client: :class:`flask.testing.FlaskClient`
    """

    data = dict(
        username='Midas Bergveen',
        password='w8woord',
        remember=False
    )

    client.post('/api/auth/login',
                data=json.dumps(data),
                content_type='application/json')

    yield

    client.post('/api/auth/logout')


@pytest.fixture
def login_view_only(client):
    """
    Logs in a view-only user before each test.

    Client is recreated for each test, so the cookies should be set again.

    :param client: Flask test client
    :type client: :class:`flask.testing.FlaskClient`
    """
    data = dict(
        username='Twan van Broekhoven',
        password='SomethingClever',
        remember=False
    )

    client.post('/api/auth/login',
                data=json.dumps(data),
                content_type='application/json')

    yield

    client.post('/api/auth/logout')


@pytest.fixture
def create_db_without_users(db):
    """
    Create the database before each test.

    After the test has been ran, all tables except for the user table
    are deleted. This is because the user table is resource intensive to make.

    :param db: The ORM object
    :type db: :class:`flask_sqlalchemy.SQLAlchemy`
    """
    db.create_all()

    yield

    db.session.close()
    db.metadata.drop_all(bind=db.engine,
                         tables=[table for k, table in db.metadata.tables.items()
                                 if k != 'user'])
