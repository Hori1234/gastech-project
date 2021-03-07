import pytest
from marshmallow import Schema
from datetime import date, time, datetime
from pandas import Timestamp
from backend.extensions import DateValidation, TimeValidation


class DateSchema(Schema):
    date = DateValidation()


class TimeSchema(Schema):
    time = TimeValidation()


@pytest.mark.parametrize('input_value', (date(year=2020, month=10, day=8),
                                         Timestamp(year=2020, month=10, day=8),
                                         "2020-10-8"))
def test_date_validation(input_value):
    data = dict(
        date=input_value
    )
    result = DateSchema().load(data)
    assert isinstance(result['date'], date)
    assert result['date'].year == 2020
    assert result['date'].month == 10
    assert result['date'].day == 8


@pytest.mark.parametrize('input_value', (time(hour=4, minute=20),
                                         260,
                                         "4:20"))
def test_time_validation(input_value):
    data = dict(
        time=input_value
    )
    result = TimeSchema().load(data)
    assert isinstance(result['time'], time)
    assert result['time'].hour == 4
    assert result['time'].minute == 20
