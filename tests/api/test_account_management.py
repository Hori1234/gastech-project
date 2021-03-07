import pytest
import json
from backend.models import User


@pytest.fixture(autouse=True)
def setup_db(setup_users, login_admin, create_db_without_users):
    """
    Run the fixtures needed for this module.
    """
    pass


def remove_user(client, user_id):
    """
    Removes the given user from the database
    :param client: the client to make the request
    :param user_id: the user to be deleted
    :return: 204 if successful, 404 if user was not found,
             400 if user is logged in
    """
    return client.delete(f'/api/auth/user/{user_id}')


def add_user(client, **kwargs):
    """
    Adds a user with given username, password and role
    :param client: the client to make the request
    :return: the created user, 201 if successful
    """
    return client.post('/api/auth/user',
                       data=json.dumps(kwargs),
                       content_type='application/json')


def change_user_details(client, userid, **kwargs):
    """
    Changes the details of an existing user
    :param client: the client to make the request
    :param userid: the user whose details need changing
    :param kwargs: the details that need to be changed
    :return:
    """
    return client.patch(f'/api/auth/user/{userid}',
                        data=json.dumps(kwargs),
                        content_type='application/json')


def get_user_list(client, page, per_page):
    """
    Gets the list of all users in the database
    :param client: the client to make the request
    :param page: the page to be shown
    :param per_page: the amount of users per page
    :return:
    """
    pagedetails = dict(
        page=page,
        page_size=per_page
    )
    return client.get('/api/auth/users', query_string=pagedetails)


def test_create_account(db, client):
    """
    Tests the intended use of the create account endpoint.
    """
    rv = add_user(client,
                  username="Bernard",
                  password="wachtzin",
                  role="view-only")

    assert rv.status_code == 201
    data = rv.get_json()
    assert data['username'] == "Bernard"
    assert data['role'] == "view-only"
    assert 'id' in data

    user = User.query.get(3)
    # make sure the user password is encrypted
    assert user.password.decode('utf-8') != 'wachtzin'

    # clean up user after the test
    db.session.delete(user)
    db.session.commit()


def test_create_incomplete_account(client):
    """
    Tests the create account endpoint with incomplete information.
    """
    rv = add_user(client,
                  username="Bernhardt",
                  role="planner")

    assert rv.status_code == 422
    assert 'password' in rv.get_json()['errors']['json']


def test_create_wrong_role(client):
    """
    Tests create account endpoint with a role that is not one of 'view-only',
    'planner' or 'administrator'.
    """
    rv = add_user(client,
                  username="morris",
                  password="Teststststs",
                  role="god-king")

    assert rv.status_code == 400
    assert 'message' in rv.get_json()


def test_create_duplicate_user(client):
    """
    Tests create account endpoint with a user that already exists, with the
    same username.
    """
    rv = add_user(client,
                  username="Twan van Broekhoven",
                  password="irrelevant",
                  role="view-only")

    assert rv.status_code == 400
    assert 'message' in rv.get_json()


def test_change_information(client):
    """
    Tests the intended use of the edit account endpoint.
    """
    rv = change_user_details(client, 2,
                             username="Broek van Twanhoven",
                             password="somethingdumb",
                             role="planner")

    assert rv.status_code == 200
    data = rv.get_json()
    assert data['username'] == "Broek van Twanhoven"
    assert data['role'] == "planner"
    assert 'id' in data


def test_change_information_duplicate(client):
    """
    Tests the edit account endpoint but the name is the same as the one of the
    other users.
    """
    rv = change_user_details(client, 2,
                             username="Midas Bergveen")

    assert rv.status_code == 400


def test_change_information_bad_role(client):
    """
    Tests the edit account endpoint with a role that is not one of 'view-only',
    'planner' or 'administrator'.
    """
    rv = change_user_details(client, 2,
                             role="the-worst")

    assert rv.status_code == 400


def test_change_own_information(client):
    """
    Tests the edit account endpoint when the user tries to change his own
    information or role.
    """
    rv = change_user_details(client, 1,
                             username="Morris Roozen",
                             role="view-only")

    assert rv.status_code == 400


def test_change_non_existent_account(client):
    """
    Tests the edit account endpoint for changing an account that does not exist.
    """
    rv = change_user_details(client, 300,
                             username="zeus the mighty")

    assert rv.status_code == 404


def test_get_user_list(client):
    """
    Tests the intended use of the get user list endpoint.
    """
    rv = get_user_list(client, 1, 10)
    data = rv.get_json()

    assert rv.status_code == 200
    assert len(data) == 2
    assert data[0]['username'] == "Midas Bergveen"


def test_get_too_many_users(client):
    """
    Tests the get user list endpoint for too many users, this many users do not
    exist.
    """
    rv = get_user_list(client, 2, 10)

    assert rv.status_code == 404


def test_delete_account(db, client):
    """
    Tests the intended use of the delete account endpoint.
    """
    rv = remove_user(client, 2)

    assert rv.status_code == 204

    # clean up after test
    user = User(username='Twan van Broekhoven',
                password='SomethingClever',
                role='administrator')
    db.session.add(user)
    db.session.commit()


def test_delete_nonexistent_account(client):
    """
    Tests the delete account endpoint but for an account that does not exist.
    """
    rv = remove_user(client, 300)

    assert rv.status_code == 404


def test_delete_own_account(client):
    """
    Tests the delete account endpoint but for the account of the user trying
    to delete the account.
    """
    rv = remove_user(client, 1)

    assert rv.status_code == 400
