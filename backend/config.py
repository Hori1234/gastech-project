import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    SECRET_KEY = os.environ.get("SECRET_KEY") or "wowsupersecretenzo"

    # Data validation configuration
    ROLES = ['view-only', 'planner', 'administrator']
    TERMINALS = ['KAT', 'ITV', 'OSS']
    TRUCK_TYPES = ['terminal', 'regional', 'port']

    # API configuration
    FLASK_RUN_HOST = '0.0.0.0'
    FLASK_RUN_PORT= 5000
    API_TITLE = 'O.T.M.D API'
    API_VERSION = '1.0'
    OPENAPI_VERSION = '3.0.0'
    #OPENAPI_SWAGGER_UI_VERSION = '2.0'
    OPENAPI_JSON_PATH = './static/swagger.json'
    OPENAPI_URL_PREFIX = '/'
    OPENAPI_SWAGGER_UI_PATH = '/api'
    OPENAPI_SWAGGER_UI_URL = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist/'

    # SQLalchemy configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URI') or \
        'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
