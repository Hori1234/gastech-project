import pytest
import json
from backend.models import User


@pytest.fixture(autouse=True)
def setup_db(db):
    """
    Run the fixtures needed for this module.
    """
    db.create_all()

    user = User(username='Midas Bergveen',
                password='w8woord',
                role='administrator')
    db.session.add(user)
    user1 = User(username='Twan van Broekhoven',
                 password='SomethingClever',
                 role='administrator')
    db.session.add(user1)
    db.session.commit()

    yield

    db.session.close()
    db.drop_all()


def login(client, username: str, password: str, remember_me: bool):
    """
    Makes a post request to /api/auth/login with the provided parameters.

    :param client: The testing client to make the request
    :param username: Username for the post request
    :param password: Password for the post request
    :param remember_me: Remember for the post request
    :return response: response of the endpoint
    :rtype: :class:`werkzeug.Response`
    """
    data = dict(
        username=username,
        password=password,
        remember=remember_me
    )

    return client.post('/api/auth/login',
                       data=json.dumps(data),
                       content_type='application/json')


def logout(client):
    """
    Makes a post request to /api/auth/logout.

    :param client: Teh testing client to make the request
    :return response: response of the endpoint
    :rtype: :class:`werkzeug.Response`
    """
    return client.post('/api/auth/logout')


def test_login_logout_normal(client):
    """
    Tests the intended use of the login and logout endpoint.
    """
    rv = login(client, 'Midas Bergveen', 'w8woord', True)
    assert rv.status_code == 200  # should be logged in
    assert rv.get_json()['id'] == 1  # check whether the correct user is logged in

    rv = logout(client)
    assert rv.status_code == 204  # should be logged out


def test_login_wrong_credentials(client):
    """
    Tests the login endpoint when wrong credentials are given.
    """
    rv = login(client, 'Midas Bergveen', 'wrongPassword', True)
    assert rv.status_code == 401  # should not be logged in

    rv = login(client, 'Wrong Username', 'w8woord', True)
    assert rv.status_code == 401  # should not be logged in

    rv = login(client, 'Wrong Username', 'wrongPassword', True)
    assert rv.status_code == 401  # should not be logged in


def test_login_case_sensitive_username(client):
    """
    Tests the login endpoint when supplying a username in lowercase.
    """
    rv = login(client, 'midas bergveen', 'w8woord', True)
    assert rv.status_code == 200  # should be logged in
    assert rv.get_json()['id'] == 1  # check whether the logged in user is correct


def test_login_case_sensitive_password(client):
    """
    Tests the case sensitivity of a password in the login endpoint.
    """
    rv = login(client, 'Midas Bergveen', 'W8woorD', True)
    assert rv.status_code == 401  # should not be logged in


def test_new_login_while_logged_in(client):
    """
    Tests the response of logging in as another user
    while already being logged in.

    Should respond with 200, as another user is logged in.
    """
    rv = login(client, 'Midas Bergveen', 'w8woord', True)
    assert rv.status_code == 200  # Midas is logged in
    assert rv.get_json()['id'] == 1

    rv = login(client, 'Twan van Broekhoven', 'SomethingClever', True)
    assert rv.status_code == 200  # Twan remains logged in
    assert rv.get_json()['id'] == 2


def test_same_login_while_logged_in(client):
    """
    Test the response of logging in while already logged in.

    Should respond with 200, as the same user remains logged in
    """
    rv = login(client, 'Midas Bergveen', 'w8woord', True)
    assert rv.status_code == 200  # User is logged in
    assert rv.get_json()['id'] == 1  # User is Midas

    rv = login(client, 'Midas Bergveen', 'w8woord', True)
    assert rv.status_code == 200  # User is still logged in
    assert rv.get_json()['id'] == 1  # User is still Midas


def test_login_after_logging_out(client):
    """
    Tests logging in with a different user after logging in.
    """
    rv = login(client, 'Midas Bergveen', 'w8woord', True)
    assert rv.status_code == 200  # User is logged in
    assert rv.get_json()['id'] == 1  # User is Midas

    rv = logout(client)
    assert rv.status_code == 204  # User is logged out

    rv = login(client, 'Twan van Broekhoven', 'SomethingClever', True)
    assert rv.status_code == 200  # User is logged in
    assert rv.get_json()['id'] == 2  # User is Twan


def test_logout_not_logged_in(client):
    """
    Tests whether users can log out while already being logged out.

    As logging out is a protected endpoint, a logged out person should
    not be able to log out again.
    """
    rv = logout(client)
    assert rv.status_code == 401  # Unauthorized


def test_get_current_user(client):
    """
    Tests correct use of the get user endpoint.
    """
    login(client, 'Midas Bergveen', 'w8woord', True)
    rv = client.get('/api/auth/user')
    assert rv.status_code == 200  # User is logged in
    assert rv.get_json()['id'] == 1  # User is Midas


def test_get_user_no_auth(client):
    """
    Tests the get user endpoint when no one is logged in
    """
    rv = client.get('/api/auth/user')
    assert rv.status_code == 401  # no user is logged in

    login(client, 'Midas Bergveen', 'w8woord', True)
    logout(client)

    rv = client.get('/api/auth/user')
    assert rv.status_code == 401  # no user is logged in
