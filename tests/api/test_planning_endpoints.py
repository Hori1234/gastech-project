import datetime
from contextlib import contextmanager
from pathlib import Path
import pytest
import json

from backend.models import Truck, TruckSheet, Order, OrderSheet, Planning


def get_file_path(file):
    return Path(__file__).parent / 'data' / file


@contextmanager
def login_as_admin(client):
    """
    Logs in an admin.

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


@contextmanager
def login_as_view_only(client):
    """
    Logs in a view-only user.

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


@pytest.fixture(autouse=True)
def setup_db(setup_users, login_admin, create_db_without_users, client):
    """
    Setup the database for the current test.
    """

    for i in range(2):
        data = dict(
            file_1=(open(get_file_path('truck_availability_test.xlsx'), 'rb'),
                    'sheet.xlsx')
        )

        client.post('/api/sheets/', content_type='multipart/form-data',
                    data=data)

        data2 = dict(
            file_1=(open(get_file_path('order_sheet_test.xlsx'), 'rb'),
                    'sheet.xlsx')
        )

        client.post('/api/sheets/', content_type='multipart/form-data',
                    data=data2)

    # The above two files are uploaded at pretty much the same time, so it is
    # not defined which one is the latest
    OrderSheet.query.get(2).upload_date += datetime.timedelta(hours=1)
    TruckSheet.query.get(2).upload_date += datetime.timedelta(hours=1)


def get_order(client, order_id):
    """
    returns the order specified.
    :param client: The test client to make the request with
    :param order_id: The id of the order to find
    :return: Order with id=id
    """
    return client.get(f'/api/orders/{order_id}')


def get_truck(client, truck_id):
    """
    returns the truck specified.
    :param client: The test client to make the request with
    :param truck_id: The id of the truck to find
    :return: truck with id=id
    """
    return client.get(f'/api/trucks/{truck_id}')


def post_order(client, sheet_id, **kwargs):
    """
    attempts to add the specified order
    :param client: the client to make the request with
    :param sheet_id: the sheet to add the order to
    :param kwargs: the details of the order to add
    :return:
    """
    return client.post(f'/api/orders/sheet/{sheet_id}',
                       data=json.dumps(kwargs),
                       content_type='application/json')


def post_truck(client, sheet_id, **kwargs):
    """
    attempts to add the specified truck
    :param client: the client to make the request with
    :param sheet_id: the sheet to add the truck to
    :param kwargs: the details of the truck to add
    :return:
    """
    return client.post(f'/api/trucks/sheet/{sheet_id}',
                       data=json.dumps(kwargs),
                       content_type='application/json')


def patch_order(client, order_id, **kwargs):
    """
    attempts to change the specified row in order
    :param client: the client to make the request with
    :param order_id: the id of the order to change
    :param kwargs: the data that needs to be changed
    :return:
    """
    return client.patch(f'/api/orders/{order_id}',
                        data=json.dumps(kwargs),
                        content_type='application/json')


def patch_truck(client, truck_id, **kwargs):
    """
    attempts to change the specified row in truck
    :param client: the client to make the request with
    :param truck_id: the id of the truck to change
    :param kwargs: the data that needs to be changed
    :return:
    """
    return client.patch(f'/api/trucks/{truck_id}',
                        data=json.dumps(kwargs),
                        content_type='application/json')


def get_orders(client, sheet_id):
    """
    retrieves the orders associated with the specified sheet
    :param client: the client to make the request with
    :param sheet_id: the sheet to get the info from
    :return: a list of all order associated with the specified sheet
    """
    return client.get(f'/api/orders/sheet/{sheet_id}')


def get_trucks(client, sheet_id):
    """
    retrieves the trucks associated with the specified sheet
    :param client: the client to make the request with
    :param sheet_id: the sheet to get the info from
    :return: a list of all trucks associated with the specified sheet
    """
    return client.get(f'/api/trucks/sheet/{sheet_id}')


def delete_order(client, order_id):
    """
    deletes the specified order from the database
    :param client: the client to make the request
    :param order_id: the order to be deleted
    :return:
    """
    return client.delete(f'/api/orders/{order_id}')


def delete_truck(client, truck_id):
    """
    deletes the specified truck from the database
    :param client: the client to make the request
    :param truck_id: the truck to be deleted
    :return:
    """
    return client.delete(f'/api/trucks/{truck_id}')


def get_timeline(client, sheet_id):
    """
    Gets the parameters to create a timeline of the orders assignment
    :param client: the client to make the request
    :param sheet_id: the id of the order sheet to make a timeline of
    :return:
    """
    return client.get(f'/api/orders/timeline/{sheet_id}')


def publish_planning(client, truck_sheet_id, order_sheet_id):
    """
    Publishes a planning with the specified order sheet and truck sheet
    :param client: the client to make the request
    :param truck_sheet_id: the id of the truck sheet to publish
    :param order_sheet_id: the id of the order sheet to publish
    :return:
    """
    return client.post(f'/api/plannings/{truck_sheet_id}/{order_sheet_id}')


def get_planning(client, truck_sheet_id, order_sheet_id):
    """
    Gets a planning with the specified order sheet and truck sheet
    :param client: the client to make the request
    :param truck_sheet_id: the id of the truck sheet
    :param order_sheet_id: the id of the order sheet
    :return:
    """
    return client.get(f'/api/plannings/{truck_sheet_id}/{order_sheet_id}')


def get_plannings(client, page, per_page):
    """
    Gets the list of all plannings in the database
    :param client: the client to make the request
    :param page: the page to be shown
    :param per_page: the amount of plannings per page
    :return:
    """
    pagedetails = dict(
        page=page,
        page_size=per_page
    )
    return client.get('/api/plannings/', query_string=pagedetails)

# GET ORDER TESTS


def test_get_order(client, db):
    """
    Tests the intended use of the get order endpoint.
    """
    rv = get_order(client, 1)

    assert rv.status_code == 200
    data = rv.get_json()
    assert data['order_number'] == 1


def test_get_order_invalid(client, db):
    """
    Tests the get order endpoint but with an invalid order number.
    """
    rv = get_order(client, 1000000)

    assert rv.status_code == 404

# GET TRUCK TESTS


def test_get_truck(client, db):
    """
    Tests the intended use of the get truck endpoint.
    """
    rv = get_truck(client, 1)

    assert rv.status_code == 200
    data = rv.get_json()
    assert data['s_number'] == 1


def test_get_truck_invalid(client, db):
    """
    Tests the get truck endpoint but with an invalid truck id.
    """
    rv = get_truck(client, 1000000)

    assert rv.status_code == 404

# GET ORDERS TESTS


def test_get_orders(client, db):
    """
    Tests the intended use of the get orders endpoint.
    """
    rv = get_orders(client, 1)

    assert rv.status_code == 200
    data = rv.get_json()
    assert len(data) > 0


def test_get_orders_invalid(client, db):
    """
    Tests the get orders endpoint but with invalid order numbers.
    """
    rv = get_orders(client, 20)

    assert rv.status_code == 404


def test_get_orders_latest(client, db):
    """
    Tests the intended use of the get order sheet latest endpoint.
    """
    rv = get_orders(client, 'latest')

    assert rv.status_code == 200
    data = rv.get_json()
    assert len(data) > 0


def test_get_orders_not_latest(client, db):
    """
    Tests the get order sheet latest endpoint but not with the latest sheet.
    """
    rv = get_orders(client, 'first')

    assert rv.status_code == 404


# TODO: UTP
@pytest.mark.parametrize('sheet_id', (1, 'latest'))
def test_get_orders_view_only(client, db, sheet_id):
    """
    Tests the get order sheet with a view-only user.
    """
    with login_as_view_only(client):
        rv = get_orders(client, sheet_id)
        assert rv.status_code == 404

    with login_as_admin(client):
        rv = publish_planning(client, 1, sheet_id)
        assert rv.status_code == 200

    with login_as_view_only(client):
        rv = get_orders(client, sheet_id)
        assert rv.status_code == 200
        data = rv.get_json()['orders']
        assert len(data) > 5

        order_sheet = OrderSheet.query.get(
            sheet_id if sheet_id != 'latest' else 2)
        assert order_sheet.orders[0].order_number == data[0]['order_number']


# GET TRUCKS TESTS

def test_get_trucks(client, db):
    """
    Tests the intended use of the get trucks endpoint.
    """
    rv = get_trucks(client, 1)

    assert rv.status_code == 200
    data = rv.get_json()
    assert len(data) > 0


def test_get_trucks_invalid(client, db):
    """
    Tests the get trucks endpoint but with an invalid truck.
    """
    rv = get_trucks(client, 20)

    assert rv.status_code == 404


def test_get_trucks_latest(client, db):
    """
    Tests the intended use of the get truck sheet latest endpoint.
    """
    rv = get_trucks(client, 'latest')

    assert rv.status_code == 200
    data = rv.get_json()
    assert len(data) > 0


def test_get_trucks_not_latest(client, db):
    """
    Tests the truck sheet latest endpoint but not with the latest sheet.
    """
    rv = get_trucks(client, 'test')

    assert rv.status_code == 404


# TODO: UTP
@pytest.mark.parametrize('sheet_id', (1, 'latest'))
def test_get_trucks_view_only(client, db, sheet_id):
    """
    Tests the get truck sheet with a view-only user.
    """
    with login_as_view_only(client):
        rv = get_trucks(client, sheet_id)
        assert rv.status_code == 404

    with login_as_admin(client):
        rv = publish_planning(client, sheet_id, 1)
        assert rv.status_code == 200

    with login_as_view_only(client):
        rv = get_trucks(client, sheet_id)
        assert rv.status_code == 200
        data = rv.get_json()['trucks']
        assert len(data) > 5

        truck_sheet = TruckSheet.query.get(
            sheet_id if sheet_id != 'latest' else 2)
        assert truck_sheet.trucks[0].s_number == data[0]['s_number']


# PATCH ORDER TESTS


def test_patch_order(client, db):
    """
    Tests the intended use of the patch order endpoint.
    """
    request = dict(
        truck_type='regional',
        inl_terminal='KAT',
        SomethingNew='TEST',
        SomethingNewAlso=None
    )
    rv = patch_order(client, 1, **request)

    assert rv.status_code == 200
    order = Order.query.get(1)
    assert order.truck_type == 'regional'
    assert order.inl_terminal == 'KAT'
    assert order.others['SomethingNew'] == 'TEST'
    assert 'SomethingNewAlso' not in order.others


def test_patch_order_remove_others(client, db):
    """
    Tests the patch order endpoint but when you remove data one of the
    not required columns that then the order is still valid.
    """
    request = dict(
        Container=None
    )
    rv = patch_order(client, 1, **request)
    assert rv.status_code == 200
    order = Order.query.get(1)
    assert 'Container' not in order.others


def test_patch_order_invalid(client, db):
    """
    Tests the patch order endpoint but when you remove or change data one of the
    required columns that then the order is not correct or acceptable anymore.
    """
    request = dict(
        truck_type='big',
        inl_terminal='DOG'
    )
    rv = patch_order(client, 1, **request)

    assert rv.status_code == 400


def test_patch_order_wrong(client, db):
    """
    Tests the patch order endpoint but with a non-existing order number.
    """
    rv = patch_order(client, 10000)

    assert rv.status_code == 404


def test_patch_order_set_truck_id(client, db):
    """
    Tests the patch order when setting and removing a truck_id and departure
    time.
    """
    request = dict(
        truck_s_number=14,
        departure_time='12:30'
    )
    rv = patch_order(client, 1, **request)

    # truck has been added
    assert rv.status_code == 200
    assert rv.get_json()['truck_id'] == 'V22'
    assert rv.get_json()['departure_time'] == '12:30:00'

    order = Order.query.get(1)
    truck = Truck.query.get(14)
    # also been changed in the database
    assert order.departure_time.strftime('%H:%M') == '12:30'
    assert order.truck == truck

    request2 = dict(
        truck_s_number=None
    )
    rv2 = patch_order(client, 1, **request2)

    # truck has been removed from the order
    assert rv2.status_code == 200
    assert rv2.get_json()['truck_id'] is None
    assert rv2.get_json()['departure_time'] is None
    assert order.truck is None
    assert order.departure_time is None


@pytest.mark.parametrize('departure_time', ('2:00', '23:59'))
def test_patch_order_departure_time_invalid(client, departure_time):
    """
    Tests if an error response is given after setting the departure time
    later than the latest departure time of the order or earlier than the
    starting time of the assigned truck.
    """
    request = dict(
        truck_s_number=14,
        departure_time=departure_time,
    )

    rv2 = patch_order(client, 1, **request)

    assert rv2.status_code == 400
    assert 'message' in rv2.get_json()
    message = rv2.get_json()['message']
    assert departure_time in message
    if departure_time == '2:00':
        assert 'starting time' in message
    else:
        assert 'latest departure time' in message


def test_patch_order_invalid_truck(client):
    """
    Tests if an error response is given after assigning a truck to an order
    it cannot carry out.
    """
    request = dict(
        truck_s_number=1,
        departure_time='8:00'
    )

    rv2 = patch_order(client, 1, **request)

    assert rv2.status_code == 400
    assert 'message' in rv2.get_json()
    assert 'terminal' in rv2.get_json()['message']
    assert 'port' in rv2.get_json()['message']


def test_patch_order_primary_key(client):
    """
    Tests for an error response when trying to set the primary key
    """

    request = dict(
        order_number=14
    )

    rv = patch_order(client, 1, **request)

    assert rv.status_code == 400
    assert 'order_number' in rv.get_json()['message']


def test_patch_truck_computed_field(client):
    """
    Tests for an error response when trying to set a computed field
    """

    request = dict(
        service_time=100
    )

    rv = patch_order(client, 1, **request)

    assert rv.status_code == 400
    assert 'service_time' in rv.get_json()['message']


# TODO: UTP
def test_patch_order_with_truck_id_without_departure_time(client):
    """
    Tests patch order with a truck ID and departure time.
    """
    request = dict(
        truck_s_number=14
    )
    rv = patch_order(client, 1, **request)

    assert rv.status_code == 400
    data = rv.get_json()
    assert 'truck S number' in data['message']
    assert 'departure time' in data['message']


# TODO: UTP
def test_patch_order_with_departure_time_without_truck_id(client):
    """
    Tests patch order with a truck ID and departure time.
    """
    request = dict(
        departure_time='12:00'
    )
    rv = patch_order(client, 1, **request)

    assert rv.status_code == 400
    data = rv.get_json()
    assert 'truck S number' in data['message']
    assert 'departure time' in data['message']


# TODO: UTP
def test_patch_order_with_departure_time_truck_set(client, db):
    """
    Tests if the departure time can be set if the truck is already set
    """
    request1 = dict(
        truck_s_number=14,
        departure_time='12:00'
    )

    rv1 = patch_order(client, 1, **request1)

    assert rv1.status_code == 200

    request2 = dict(
        departure_time='10:00'
    )

    rv2 = patch_order(client, 1, **request2)

    assert rv2.status_code == 200
    data = rv2.get_json()
    assert data['departure_time'] == '10:00:00'

    order = Order.query.get(1)
    assert order.truck_s_number == 14
    assert order.departure_time.strftime('%H:%M') == '10:00'


# TODO: UTP
@pytest.mark.parametrize('key', ('Inl. terminal', 'Max. dep. time'))
def test_patch_order_dot_seperated(client, db, key):
    """
    Tests if dot seperated keys are set correctly.
    This is an issue with Marshmallow parsing, where request keys
    with '.' are parsed as paths ({'1.2': '3'} -> {'1': {'2': '3'}})
    """

    request = dict()
    request[key] = 'val'

    rv = patch_order(client, 1, **request)

    assert rv.status_code == 200
    data = rv.get_json()
    assert key in data
    assert data[key] == 'val'

    order = Order.query.get(1)
    assert order.others[key] == 'val'


# TODO: UTP
def test_patch_order_published(client, db):
    """
    Tests if patching an order which has already been published responds
    with an error.
    """
    rv = publish_planning(client, 1, 1)
    assert rv.status_code == 200

    request = dict(
        truck_s_number=14,
        departure_time='12:00'
    )

    rv = patch_order(client, 1, **request)

    assert rv.status_code == 400
    data = rv.get_json()
    assert 'message' in data
    assert 'planning' in data['message']
    assert 'change' in data['message']

# PATCH TRUCK TESTS


def test_patch_truck(client, db):
    """
    Tests the intended use of the patch truck endpoint.
    """
    request = dict(
        truck_type='port',
        terminal='KAT',
        SomethingNew='NEW!',
        SomethingNewAlso=None
    )
    rv = patch_truck(client, 1, **request)

    assert rv.status_code == 200
    truck = Truck.query.get(1)
    assert truck.truck_type == 'port'
    assert truck.terminal == 'KAT'
    assert truck.others['SomethingNew'] == 'NEW!'
    assert 'SomethingNewAlso' not in truck.others


def test_patch_truck_remove_others(client, db):
    """
    Tests the patch truck endpoint but when you remove data one of the
    not required columns that then the truck is still valid.
    """
    request = dict(
        Driver=None,
    )

    rv = patch_truck(client, 1, **request)
    assert rv.status_code == 200

    truck = Truck.query.get(1)
    assert 'Driver' not in truck.others


def test_patch_truck_invalid(client, db):
    """
    Tests the patch truck endpoint but when you remove data one of the
    required columns that then the truck is not valid anymore.
    """
    request = dict(
        truck_type='medium',
        terminal='SAD'
    )
    rv = patch_truck(client, 1, **request)

    assert rv.status_code == 400


def test_patch_truck_wrong(client, db):
    """
    Tests the patch truck endpoint but with a wrong truck id.
    """
    rv = patch_truck(client, 100000)

    assert rv.status_code == 404


def test_patch_truck_with_orders(client, db):
    """
    Tests the intended use of the patch truck endpoint with an associated
    order.
    """
    request = dict(
        truck_type='port',
        orders=[dict(
            order_number=1,
            departure_time='12:30'
        ), dict(
            order_number=7,
            departure_time='7:00'
        )
        ]
    )
    rv = patch_truck(client, 1, **request)

    assert rv.status_code == 200

    truck = Truck.query.get(1)
    assert truck.truck_type == 'port'
    assert len(truck.orders) == 2
    assert truck.orders[0].order_number == 1


def test_patch_truck_with_wrong_orders(client, db):
    """
    Tests the patch truck endpoint with a wrongly associated order.
    """
    request = dict(
        truck_type='port',
        orders=[dict(
            order_number=1,
            departure_time='12:30'
        ), dict(
            order_number=1000,
            departure_time='10:00'
        )
        ]
    )
    rv = patch_truck(client, 1, **request)

    assert rv.status_code == 404


# TODO: UTP
def test_patch_truck_primary_key(client):
    """
    Tests an error response when trying to set the primary key
    """

    request = dict(
        s_number=14
    )

    rv = patch_truck(client, 1, **request)

    assert rv.status_code == 400
    assert 's_number' in rv.get_json()['message']


# TODO: UTP
@pytest.mark.parametrize('key', ('Inl. terminal', 'Max. dep. time'))
def test_patch_truck_dot_seperated(client, db, key):
    """
    Tests if dot seperated keys are set correctly.
    This is an issue with Marshmallow parsing, where request keys
    with '.' are parsed as paths ({'1.2': '3'} -> {'1': {'2': '3'}})
    """

    request = dict()
    request[key] = 'val'

    rv = patch_truck(client, 1, **request)

    assert rv.status_code == 200
    data = rv.get_json()
    assert key in data
    assert data[key] == 'val'

    truck = Truck.query.get(1)
    assert truck.others[key] == 'val'


# TODO: UTP
def test_patch_truck_published(client, db):
    """
    Tests if patching a truck which has already been published responds
    with an error.
    """
    rv = publish_planning(client, 1, 1)
    assert rv.status_code == 200

    request = dict(
        truck_type='port',
        terminal='KAT'
    )

    rv = patch_truck(client, 1, **request)

    assert rv.status_code == 400
    data = rv.get_json()
    assert 'message' in data
    assert 'planning' in data['message']
    assert 'change' in data['message']

# POST ORDER TESTS


def test_post_order(client, db):
    """
    Tests the intended use of the post order endpoint.
    """
    request = dict(
        inl_terminal='ITV', latest_dep_time=1000,
        truck_type='port', hierarchy=3, delivery_deadline='20:00',
        driving_time=10, process_time=1, service_time=2
    )
    rv = post_order(client, 1, **request)
    assert rv.status_code == 200
    data = rv.get_json()
    order = Order.query.get_or_404(data['order_number'])
    assert order.hierarchy == 3


def test_post_order_invalid_truck_type(client, db):
    """
    Tests the post order endpoint but with an invalid truck type.
    """
    request = dict(
        inl_terminal='KAT', latest_dep_time=1000,
        truck_type='TEST', hierarchy=3, delivery_deadline='20:00',
        driving_time=10, process_time=1, service_time=21
    )
    rv = post_order(client, 1, **request)
    assert rv.status_code == 400


def test_post_order_invalid_terminal(client, db):
    """
    Tests the post order endpoint but with an invalid terminal.
    """
    request = dict(
        inl_terminal='TEST', latest_dep_time=1000,
        truck_type='Port', hierarchy=3, delivery_deadline='20:00',
        driving_time=10, process_time=1, service_time=21
    )
    rv = post_order(client, 1, **request)
    assert rv.status_code == 400


def test_post_order_latest(client, db):
    """
    Tests the intended post order latest endpoint.
    """
    request = dict(
        inl_terminal='ITV', latest_dep_time=1000,
        truck_type='port', hierarchy=3, delivery_deadline='20:00',
        driving_time=10, process_time=1, service_time=2
    )
    rv = post_order(client, 'latest', **request)

    assert rv.status_code == 200
    data = rv.get_json()
    order = Order.query.get_or_404(data['order_number'])
    assert order.hierarchy == 3


def test_post_order_not_latest(client, db):
    """
    Tests the post order latest endpoint but not the latest.
    """
    request = dict(
        inl_terminal='ITV', latest_dep_time=1000,
        truck_type='port', hierarchy=3, delivery_deadline='20:00',
        driving_time=10, process_time=1, service_time=2
    )
    rv = post_order(client, 'same dude', **request)

    assert rv.status_code == 404


# TODO: UTP
def test_post_order_with_truck_id(client, db):
    """
    Tests post order with a truck ID and departure time.
    """
    request = dict(
        inl_terminal='ITV', latest_dep_time=1000,
        truck_type='port', hierarchy=3, delivery_deadline='20:00',
        driving_time=10, process_time=1, service_time=2,
        truck_s_number=14, departure_time='14:00'
    )
    rv = post_order(client, 1, **request)

    assert rv.status_code == 200
    data = rv.get_json()
    assert data['truck_id'] == 'V22'
    assert data['departure_time'] == '14:00:00'

    order = Order.query.get(data['order_number'])
    assert order.truck_s_number == 14
    assert order.departure_time.strftime('%H:%M') == '14:00'


# TODO: UTP
def test_post_order_with_truck_id_without_departure_time(client, db):
    """
    Tests post order with a truck ID and departure time.
    """
    request = dict(
        inl_terminal='ITV', latest_dep_time=1000,
        truck_type='port', hierarchy=3, delivery_deadline='20:00',
        driving_time=10, process_time=1, service_time=2,
        truck_s_number=14
    )
    rv = post_order(client, 1, **request)

    assert rv.status_code == 400
    data = rv.get_json()
    assert 'truck S number' in data['message']
    assert 'departure time' in data['message']


# TODO: UTP
def test_post_order_with_departure_time_without_truck_id(client, db):
    """
    Tests post order with a truck ID and departure time.
    """
    request = dict(
        inl_terminal='ITV', latest_dep_time=1000,
        truck_type='port', hierarchy=3, delivery_deadline='20:00',
        driving_time=10, process_time=1, service_time=2,
        departure_time='14:00'
    )
    rv = post_order(client, 1, **request)

    assert rv.status_code == 400
    data = rv.get_json()
    assert 'truck S number' in data['message']
    assert 'departure time' in data['message']


# TODO: UTP
@pytest.mark.parametrize('key', ('Inl. terminal', 'Max. dep. time'))
def test_post_order_dot_seperated(client, db, key):
    """
    Tests if dot seperated keys are set correctly.
    This is an issue with Marshmallow parsing, where request keys
    with '.' are parsed as paths ({'1.2': '3'} -> {'1': {'2': '3'}})
    """

    request = dict(
        inl_terminal='ITV', latest_dep_time=1000,
        truck_type='port', hierarchy=3, delivery_deadline='20:00',
        driving_time=10, process_time=1, service_time=2
    )
    request[key] = 'val'

    rv = post_order(client, 1, **request)

    assert rv.status_code == 200
    data = rv.get_json()
    assert key in data
    assert data[key] == 'val'


# TODO: UTP
def test_post_order_published(client, db):
    """
    Tests if post orders returns an error when the order sheet is
    already published.
    """
    rv = publish_planning(client, 1, 1)
    assert rv.status_code == 200

    request = dict(
        inl_terminal='ITV', latest_dep_time=1000,
        truck_type='port', hierarchy=3, delivery_deadline='20:00',
        driving_time=10, process_time=1, service_time=2
    )

    rv = post_order(client, 1, **request)

    assert rv.status_code == 400
    data = rv.get_json()
    assert 'message' in data
    assert 'planning' in data['message']
    assert 'add' in data['message']


# POST TRUCK TESTS


def test_post_truck(client, db):
    """
    Tests the intended use of the post truck endpoint.
    """
    request = dict(
        truck_id='45-TBD-1', availability=True,
        truck_type='terminal', business_type='ITV', terminal='ITV',
        hierarchy=2, use_cost=17, date='2020-10-01',
        starting_time='15:30'
    )
    rv = post_truck(client, 1, **request)

    assert rv.status_code == 200
    data = rv.get_json()
    truck = Truck.query.get(data['s_number'])
    assert truck.hierarchy == 2


def test_post_truck_invalid_truck_type(client, db):
    """
    Tests the post truck endpoint but with an invalid truck type.
    """
    request = dict(
        truck_id='45-TBD-1', availability=True,
        truck_type='Sand', business_type='test', terminal='KAT',
        hierarchy=2, use_cost=17, date='2020-10-01',
        starting_time='15:30'
    )
    rv = post_truck(client, 1, **request)
    assert rv.status_code == 400


def test_post_truck_invalid_terminal(client, db):
    """
    Tests the post truck endpoint but with an invalid terminal.
    """
    request = dict(
        truck_id='45-TBD-1', availability=True,
        truck_type='terminal', business_type='ITV', terminal='TEST',
        hierarchy=2, use_cost=17, date='2020-10-01',
        starting_time='15:30'
    )
    rv = post_truck(client, 1, **request)
    assert rv.status_code == 400


def test_post_truck_latest(client, db):
    """
    Tests the intended use of the post truck latest endpoint.
    """
    request = dict(
        truck_id='45-TBD-1', availability=True,
        truck_type='terminal', business_type='ITV', terminal='ITV',
        hierarchy=2, use_cost=17, date='2020-10-01',
        starting_time='15:30'
    )
    rv = post_truck(client, 'latest', **request)

    assert rv.status_code == 200
    data = rv.get_json()
    truck = Truck.query.get_or_404(data['s_number'])
    assert truck.hierarchy == 2


def test_post_truck_not_latest(client, db):
    """
    Tests the post truck latest endpoint but not the latest.
    """
    request = dict(
        truck_id='45-TBD-1', availability=True,
        truck_type='terminal', business_type='ITV', terminal='ITV',
        hierarchy=2, use_cost=17, date='2020-10-01',
        starting_time='15:30'
    )
    rv = post_truck(client, 'more testing = more better', **request)

    assert rv.status_code == 404


def test_post_truck_with_orders(client, db):
    """
    Tests the intended use of the post truck endpoint with an associated list
    of order numbers.
    """
    request = dict(
        truck_id='45-TBD-1', availability=True,
        truck_type='port', business_type='ITV', terminal='ITV',
        hierarchy=2, use_cost=17, date='2020-10-01',
        starting_time='6:00',
        orders=[dict(
            order_number=1,
            departure_time='12:30'
        ), dict(
            order_number=7,
            departure_time='7:00'
        )
        ]
    )
    rv = post_truck(client, 1, **request)

    assert rv.status_code == 200


def test_post_truck_with_wrong_orders(client, db):
    """
    Tests the post truck endpoint but with a list of order numbers that is
    invalid.
    """
    request = dict(
        truck_id='45-TBD-1', availability=True,
        truck_type='terminal', business_type='ITV', terminal='ITV',
        hierarchy=2, use_cost=17, date='2020-10-01',
        starting_time='15:30',
        orders=[dict(
            order_number=1,
            departure_time='12:30'
        ), dict(
            order_number=10000,
            departure_time='10:00'
        )
        ]

    )
    rv = post_truck(client, 1, **request)

    assert rv.status_code == 404


# TODO: UTP
@pytest.mark.parametrize('key', ('Inl. terminal', 'Max. dep. time'))
def test_post_truck_dot_seperated(client, db, key):
    """
    Tests if dot seperated keys are set correctly.
    This is an issue with Marshmallow parsing, where request keys
    with '.' are parsed as paths ({'1.2': '3'} -> {'1': {'2': '3'}})
    """

    request = dict(
        truck_id='45-TBD-1', availability=True,
        truck_type='terminal', business_type='ITV', terminal='ITV',
        hierarchy=2, use_cost=17, date='2020-10-01',
        starting_time='15:30'
    )
    request[key] = 'val'

    rv = post_truck(client, 1, **request)

    assert rv.status_code == 200
    data = rv.get_json()
    assert key in data
    assert data[key] == 'val'


# TODO: UTP
def test_post_truck_published(client, db):
    """
    Tests if post trucks returns an error when the truck sheet is
    already published.
    """
    rv = publish_planning(client, 1, 1)
    assert rv.status_code == 200

    request = dict(
        truck_id='45-TBD-1', availability=True,
        truck_type='terminal', business_type='ITV', terminal='ITV',
        hierarchy=2, use_cost=17, date='2020-10-01',
        starting_time='15:30'
    )

    rv = post_truck(client, 1, **request)

    assert rv.status_code == 400
    data = rv.get_json()
    assert 'message' in data
    assert 'planning' in data['message']
    assert 'add' in data['message']

# DELETE ORDER TESTS


def test_delete_order(client, db):
    """
    Tests the intended use of the delete order endpoint.
    """
    rv = delete_order(client, 1)

    assert rv.status_code == 204

    # Check if order was deleted
    order = Order.query.get(1)
    assert order is None

    # Check if there are any orders left
    order_list = Order.query.filter_by(sheet_id=1).all()
    assert len(order_list) > 0


def test_delete_order_wrong(client, db):
    """
    Tests the delete order endpoint but with an invalid order number.
    """
    rv = delete_order(client, 100000)

    assert rv.status_code == 404


# TODO: UTP
def test_delete_order_published(client, db):
    """
    Tests if deleting an order from a published planning responds
    with an error.
    """
    rv = publish_planning(client, 1, 1)
    assert rv.status_code == 200

    rv = delete_order(client, 1)
    assert rv.status_code == 400

    data = rv.get_json()
    assert 'message' in data
    assert 'planning' in data['message']
    assert 'delete' in data['message']


# DELETE TRUCK TESTS


def test_delete_truck(client, db):
    """
    Tests the intended use of the delete truck endpoint.
    """
    rv = delete_truck(client, 1)

    assert rv.status_code == 204

    # Check if the truck was deleted
    truck = Truck.query.get(1)
    assert truck is None

    # Check if there are any trucks left
    truck_list = Truck.query.filter_by(sheet_id=1).all()
    assert len(truck_list) > 0


def test_delete_truck_wrong(client, db):
    """
    Teststhe delete truck endpoint but with an invalid truck id.
    """
    rv = delete_truck(client, 100000)

    assert rv.status_code == 404


def test_delete_then_post_truck(client, db):
    """
    Tests the post truck endpoint after a truck is deleted.
    """
    request = dict(
        truck_id='45-TBD-1', availability=True,
        truck_type='port', business_type='ITV', terminal='ITV',
        hierarchy=2, use_cost=17, date='2020-10-01',
        starting_time='6:00',
        orders=[dict(
            order_number=1,
            departure_time='12:30'
        ), dict(
            order_number=7,
            departure_time='7:00'
        )
        ]
    )
    rv = delete_truck(client, 1)
    assert rv.status_code == 204

    rv2 = post_truck(client, 'latest', **request)
    assert rv2.status_code == 200

    data = rv2.get_json()
    truck = Truck.query.get(data['s_number'])
    assert truck.truck_id == '45-TBD-1'
    assert truck.use_cost == 17


def test_delete_then_post_order(client, db):
    """
    Tests the post order endpoint after an order is deleted.
    """
    request = dict(
        inl_terminal='ITV', latest_dep_time=1000,
        truck_type='port', hierarchy=3, delivery_deadline='20:00',
        driving_time=10, process_time=1, service_time=2
    )
    rv = delete_order(client, 2)
    assert rv.status_code == 204

    rv2 = post_order(client, 'latest', **request)
    assert rv2.status_code == 200

    data = rv2.get_json()
    order = Order.query.get(data['order_number'])
    assert order.inl_terminal == 'ITV'
    assert order.process_time == 1


# TODO: UTP
def test_delete_truck_published(client, db):
    """
    Tests if deleting a truck from a published planning responds
    with an error.
    """
    rv = publish_planning(client, 1, 1)
    assert rv.status_code == 200

    rv = delete_truck(client, 1)
    assert rv.status_code == 400

    data = rv.get_json()
    assert 'message' in data
    assert 'planning' in data['message']
    assert 'delete' in data['message']

# TEST GET TIMELINE


@pytest.mark.parametrize('sheet_id', (2, 'latest'))
def test_get_timeline(client, db, sheet_id):
    """
    Tests the get timeline endpoint with correct sheet id identifiers
    """
    # Assign truck to order
    request1 = dict(
        truck_s_number=15,
        departure_time='08:00:00',
        Address='testStreet'
    )

    rv3 = patch_order(client, 139, **request1)
    assert rv3.status_code == 200

    request2 = dict(
        truck_s_number=14,
        departure_time='08:00:00',
        Address='testStreet'
    )

    rv2 = patch_order(client, 140, **request2)
    assert rv2.status_code == 200

    rv = get_timeline(client, sheet_id)
    assert rv.status_code == 200

    data = rv.get_json()
    expected = dict(
        address=request2['Address'],
        booking_id='167617C',
        client=None,
        container_id='TCNU 948989 7',
        departure_time=request2['departure_time'],
        end_time="13:00:00",
        order_type='port',
        truck_id='V22'
    )
    assert len(data) == 2
    assert expected in data


@pytest.mark.parametrize('sheet_id', ('random', 3))
def test_get_timeline_wrong_sheet(client, sheet_id):
    """
    Tests the get timeline endpoint with wrong sheet id identifiers
    """
    rv = get_timeline(client, sheet_id)
    assert rv.status_code == 404


# TODO: UTP
@pytest.mark.parametrize('sheet_id', (2, 'latest'))
def test_get_timeline_view_only(client, db, sheet_id):
    """
    Tests the get timeline endpoint with a view-only user
    """
    # Assign truck to order
    request1 = dict(
        truck_s_number=15,
        departure_time='08:00:00',
        Address='testStreet'
    )

    rv3 = patch_order(client, 139, **request1)
    assert rv3.status_code == 200

    request2 = dict(
        truck_s_number=14,
        departure_time='08:00:00',
        Address='testStreet'
    )

    rv2 = patch_order(client, 140, **request2)
    assert rv2.status_code == 200

    rv = get_timeline(client, sheet_id)
    assert rv.status_code == 200

    with login_as_view_only(client):
        rv = get_timeline(client, sheet_id)
        assert rv.status_code == 404

    with login_as_admin(client):
        rv = publish_planning(client, 1, sheet_id)
        assert rv.status_code == 200

    with login_as_view_only(client):
        rv = get_timeline(client, sheet_id)
        assert rv.status_code == 200
        data = rv.get_json()

        expected = dict(
            address=request2['Address'],
            booking_id='167617C',
            client=None,
            container_id='TCNU 948989 7',
            departure_time=request2['departure_time'],
            end_time="13:00:00",
            order_type='port',
            truck_id='V22'
        )

        assert len(data) == 2
        assert expected in data

# TEST POST PLANNING


# TODO: UTP
@pytest.mark.parametrize('truck_sheet_id', (2, 'latest'))
@pytest.mark.parametrize('order_sheet_id', (2, 'latest'))
def test_post_planning(client, truck_sheet_id, order_sheet_id):
    """
    Tests publishing a planning using correct inputs
    """
    rv = publish_planning(client, truck_sheet_id, order_sheet_id)

    assert rv.status_code == 200
    data = rv.get_json()

    if truck_sheet_id == 'latest':
        assert data['truck_sheet_id'] == 2
    else:
        assert data['truck_sheet_id'] == truck_sheet_id
    if order_sheet_id == 'latest':
        assert data['order_sheet_id'] == 2
    else:
        assert data['order_sheet_id'] == order_sheet_id

    assert 'published_on' in data
    assert 'user_id' in data


# TODO: UTP
@pytest.mark.parametrize('truck_sheet_id,order_sheet_id',
                         [(2, 'something'), (2, 3), ('something', 2),
                          (3, 2), ('something', 'something'), (3, 3)])
def test_post_planning_wrong_request(client, truck_sheet_id, order_sheet_id):
    """
    Tests publishing a planning using incorrect inputs
    """
    rv = publish_planning(client, truck_sheet_id, order_sheet_id)

    assert rv.status_code == 404


# TODO: UTP
@pytest.mark.parametrize('publish', ('truck', 'order', 'both'))
def test_post_planning_already_published(client, publish):
    """
    Tests publishing a planning with already published
    order sheet and truck sheets. Should respond with an error
    """
    if publish == 'truck':
        rv = publish_planning(client, 1, 2)
    elif publish == 'order':
        rv = publish_planning(client, 2, 1)
    else:
        rv = publish_planning(client, 1, 1)
    assert rv.status_code == 200

    rv = publish_planning(client, 1, 1)
    assert rv.status_code == 400
    data = rv.get_json()
    assert 'message' in data
    assert 'published planning' in data['message']


# TEST GET PLANNING

# TODO: UTP
@pytest.mark.parametrize('truck_sheet_id', (2, 'latest'))
@pytest.mark.parametrize('order_sheet_id', (2, 'latest'))
def test_get_planning(client, truck_sheet_id, order_sheet_id):
    """
    Tests the get single planning endpoint with correct inputs.
    """
    for i in range(1, 3):
        rv = publish_planning(client, i, i)
        assert rv.status_code == 200

    rv = get_planning(client, truck_sheet_id, order_sheet_id)

    assert rv.status_code == 200
    data = rv.get_json()

    if truck_sheet_id == 'latest':
        assert data['truck_sheet_id'] == 2
    else:
        assert data['truck_sheet_id'] == truck_sheet_id
    if order_sheet_id == 'latest':
        assert data['order_sheet_id'] == 2
    else:
        assert data['order_sheet_id'] == order_sheet_id


# TODO: UTP
@pytest.mark.parametrize('truck_sheet_id,order_sheet_id',
                         [(2, 'something'), (2, 3), ('something', 2),
                          (3, 2), ('something', 'something'), (3, 3)])
def test_get_planning_wrong_request(client, truck_sheet_id, order_sheet_id):
    """
    Tests the get single planning endpoint with incorrect inputs.
    """
    for i in range(1, 3):
        rv = publish_planning(client, i, i)
        assert rv.status_code == 200

    rv = get_planning(client, truck_sheet_id, order_sheet_id)

    assert rv.status_code == 404


# TEST GET PLANNINGS

# TODO: UTP
@pytest.mark.parametrize('page_size', (1, 2, 10))
def test_get_plannings(client, page_size):
    """
    Tests the get plannings endpoint
    """
    for i in range(1, 3):
        rv = publish_planning(client, i, i)
        assert rv.status_code == 200

    plan2 = Planning.query.get((2, 2))
    plan2.published_on += datetime.timedelta(hours=1)

    rv = get_plannings(client, page=1, per_page=page_size)

    assert rv.status_code == 200
    assert 'X-Pagination' in rv.headers
    data = rv.get_json()
    assert len(data) == min(page_size, 2)
    assert data[0]['order_sheet_id'] == 2
    assert data[0]['truck_sheet_id'] == 2
