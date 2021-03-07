import pytest
import json
from flask.views import MethodView
from backend.extensions import roles_required


@pytest.fixture(autouse=True)
def setup_db(setup_users):
    pass


@pytest.fixture(autouse=True, scope='module')
def secret_endpoint(app):

    class SecretEndpoint(MethodView):

        @roles_required('planner', 'administrator')
        def options(self):
            return ''

        @roles_required('planner', 'administrator')
        def get(self):
            return ''

    app.add_url_rule('/secret', view_func=SecretEndpoint.as_view('secret'))


def test_roles_required_success(client, login_admin):
    rv = client.get('/secret')
    assert rv.status_code == 200


def test_roles_required_fail_logged_in(client, login_view_only):
    rv = client.get('/secret')
    assert rv.status_code == 401


def test_roles_required_fail_logged_out(client):
    rv = client.get('/secret')
    assert rv.status_code == 401


def test_roles_required_exempt(client, login_view_only):
    rv = client.options('/secret')
    assert rv.status_code == 200


def test_roles_required_login_disabled(app, client, login_view_only):
    app.config['LOGIN_DISABLED'] = True

    rv = client.get('/secret')
    assert rv.status_code == 200
