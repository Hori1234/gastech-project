from backend.plugins import db, login
from flask import current_app
from sqlalchemy import func
from sqlalchemy.ext.hybrid import hybrid_property
from flask_login import UserMixin
from hashlib import sha256
from base64 import b64encode
import bcrypt


# Set the user loader of flask-login, so it can load users
# when they are logged in
@login.user_loader
def user_loader(user_id):
    return User.query.get(user_id)


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False)
    _password = db.Column('password',
                          db.LargeBinary(60),
                          nullable=False)
    role = db.Column(db.String(20), nullable=False, default='view-only')

    def __init__(self, username: str, password: str, role: str = 'view-only'):
        self.username = username
        self.password = password
        self.role = role

    @db.validates('role')
    def validate_role(self, key, value):
        if value not in current_app.config['ROLES']:
            raise ValueError(f'A user\'s role has to be one of '
                             f'"administrator", "planner" or "view-only", '
                             f'it cannot be "{value}"')
        return value

    @hybrid_property
    def password(self):
        return self._password

    @password.setter
    def password(self, value: str):
        """
        Hashes and stores the password using bcrypt.

        The password is first hashed using sha256,
        after which it is base64 encoded.
        This is  to prevent bcrypt only using the first 72 characters.

        :param value: the new password of the user
        :type value: str
        """
        encoded = b64encode(sha256(value.encode()).digest())
        self._password = bcrypt.hashpw(encoded, bcrypt.gensalt())

    def check_password(self, password: str):
        """
        Checks if the password of the user is correct.

        :return: whether the password was correct
        :rtype: bool
        """
        encoded = b64encode(sha256(password.encode()).digest())
        return bcrypt.checkpw(encoded, self.password)


db.Index('ix_user_username', func.lower(User.username), unique=True)
