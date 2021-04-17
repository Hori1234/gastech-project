import pytest
import datetime
from pathlib import Path

from backend.models import TruckSheet, Truck, OrderSheet, Order


@pytest.fixture(autouse=True)
def setup_db(setup_users, login_admin, create_db_without_users):
    """
    Run the fixtures needed for this module.
    """
    pass


def get_file_path(file):
    return Path(__file__).parent / 'data' / file


def upload_one_sheet(client, file):
    """
    Uploads a single sheet to the server.

    :param client: The test client to make the request with
    :param file: The file meant to be uploaded
    :return: The response of the server
    """
    data = dict(
        file_1=(open(file, 'rb'),
                'sheet.xlsx')
    )

    return client.post('/api/sheets/',
                       content_type='multipart/form-data',
                       data=data)


def get_order_sheet(client, page=1, page_size=10):
    """
    retrieves all uploaded order sheets
    :param client: the client to make the request
    :param page: page of the request
    :param page_size: number of items per page
    :return: a list of all order sheets in the database
    """
    pagination_params = dict(
        page=page,
        page_size=page_size
    )
    return client.get('/api/sheets/orders', query_string=pagination_params)


def get_truck_sheet(client, page=1, page_size=10):
    """
    retrieves all uploaded truck sheets
    :param client: the client to make the request
    :param page: page of the request
    :param page_size: number of items per page
    :return: a list of all order sheets in the database
    """
    pagination_params = dict(
        page=page,
        page_size=page_size
    )
    return client.get('/api/sheets/trucks', query_string=pagination_params)


def test_upload_ta_success(client, db):
    """
    Test just a truck availability sheet
    """
    rv = upload_one_sheet(client,
                          get_file_path('truck_availability_test.xlsx'))
    assert rv.status_code == 200
    assert TruckSheet.query.get(1)

    truck = Truck.query.get(5)
    assert truck.truck_type == 'regional'
    assert truck.terminal == 'ITV'


def test_upload_orders_success(client):
    """
    Test just an order sheet
    """
    rv = upload_one_sheet(client,
                          get_file_path('order_sheet_test.xlsx'))

    assert rv.status_code == 200
    assert OrderSheet.query.get(1)

    order = Order.query.get(7)
    assert order.latest_dep_time.strftime('%H:%M') == '08:00'
    assert order.truck_type == 'port'


def test_upload_ta_missing_column(client):
    """
    Test a single truck availability sheet with a missing column
    """
    rv = upload_one_sheet(client,
                          get_file_path('truck_availability_missing_column.xlsx'))

    assert rv.status_code == 422
    # something to assert that the columns are missing


def test_upload_ta_duplicates_in_columns(client):
    """
    Test a single truck availability sheet with duplicates in columns
    """
    rv = upload_one_sheet(
        client, get_file_path('truck_availability_duplicate_columns.xlsx'))

    assert rv.status_code == 422
    # something to assert that the columns contain duplicates


def test_upload_ta_missing_values(client):
    """
    Test a single truck availability sheet with missing values
    """
    rv = upload_one_sheet(client,
                          get_file_path('truck_availability_missing_values.xlsx'))

    assert rv.status_code == 422
    # something to assert that the columns have missing data


def test_upload_ta_data_validation_terminal(client):
    """
    Test a single truck availability sheet with incorrect terminals
    """
    rv = upload_one_sheet(
        client, get_file_path('truck_availability_wrong_terminals.xlsx'))

    assert rv.status_code == 422
    # something to assert that the column contained incorrect values


def test_upload_ta_data_validation_trucktype(client):
    """
    Test a single truck availability sheet with incorrect truck types
    """
    rv = upload_one_sheet(
        client, get_file_path('truck_availability_wrong_trucktype.xlsx'))

    assert rv.status_code == 422
    # something to assert that the column contained incorrect values


def test_upload_ta_data_validation_datetime(client):
    """
    Test a single truck availability sheet with incorrect dates
    """
    rv = upload_one_sheet(client,
                          get_file_path('truck_availability_wrong_dates.xlsx'))

    assert rv.status_code == 422
    # something to assert that the column contained incorrect values


def test_upload_ta_data_validation_numbers(client):
    """
    Test a single truck availability sheet with incorrect numbers
    """
    rv = upload_one_sheet(client,
                          get_file_path('truck_availability_wrong_numbers.xlsx'))

    assert rv.status_code == 422
    # something to assert that the column contained incorrect values


def test_upload_order_column_missing(client):
    """
    Test a single order sheet with missing columns
    """
    rv = upload_one_sheet(client,
                          get_file_path('order_sheet_missing_column.xlsx'))

    assert rv.status_code == 422
    # something to assert that the column was missing


def test_upload_order_missing_values(client):
    """
    Test a single order sheet with missing values
    """
    rv = upload_one_sheet(client,
                          get_file_path('order_sheet_missing_values.xlsx'))

    assert rv.status_code == 422
    # something to assert that the values were missing


def test_upload_order_data_validation_terminal(client):
    """
    Test a single order sheet with incorrect terminals
    """
    rv = upload_one_sheet(client,
                          get_file_path('order_sheet_wrong_terminals.xlsx'))

    assert rv.status_code == 422
    # something to assert that the values were wrong


def test_upload_order_data_validation_trucktype(client):
    """
    Test a single order sheet with incorrect truck types
    """
    rv = upload_one_sheet(client,
                          get_file_path('order_sheet_wrong_trucktype.xlsx'))

    assert rv.status_code == 422
    # something to assert that the values were wrong


def test_upload_order_data_validation_numbers(client):
    """
    Test a single order sheet with incorrect numbers
    """
    rv = upload_one_sheet(client,
                          get_file_path('order_sheet_wrong_numbers.xlsx'))

    assert rv.status_code == 422
    # something to assert that the values were wrong


def test_upload_one_but_it_is_a_pdf(client):
    """
    Test a single upload with a pdf instead of a sheet
    """
    rv = upload_one_sheet(client,
                          get_file_path('not_a_spreadsheet.pdf'))

    assert rv.status_code == 400
    # something to assert that this is not a spreadsheet


def test_upload_one_but_it_is_not_right(client):
    """
    Test a single upload with something that is neither
    """
    rv = upload_one_sheet(client,
                          get_file_path('stardew valley.xlsx'))

    assert rv.status_code == 400
    # something to assert that it's not one of the sheets


# GET ORDER SHEETS TESTS


def test_get_order_sheets(client, db):
    """
    Test getting order sheets
    """
    for i in range(2):
        upload_one_sheet(client,
                         get_file_path('order_sheet_test.xlsx'))

    OrderSheet.query.get(2).upload_date += datetime.timedelta(hours=1)

    rv = get_order_sheet(client, page=2, page_size=1)

    assert rv.status_code == 200
    data = rv.get_json()
    assert len(data) == 1
    assert data[0]['id'] == 1


# GET TRUCK SHEETS TESTS

def test_get_truck_sheets(client, db):
    """
    Test getting truck sheets
    """
    for i in range(2):
        upload_one_sheet(client,
                         get_file_path('truck_availability_test.xlsx'))

    TruckSheet.query.get(2).upload_date += datetime.timedelta(hours=1)

    rv = get_truck_sheet(client, page=2, page_size=1)

    assert rv.status_code == 200
    data = rv.get_json()
    assert len(data) == 1
    assert data[0]['id'] == 1
