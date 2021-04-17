from marshmallow.fields import Date, Time
import datetime as dt
from pandas import Timestamp


class DateValidation(Date):
    """
    Validates that the data is a correct date object
    """
    def _deserialize(self, value, attr, data, **kwargs):
        if isinstance(value, Timestamp):
            return value.to_pydatetime()
        if isinstance(value, dt.date):
            return value
        return super()._deserialize(value, attr, data)


class TimeValidation(Time):
    """
    Validates that the data is a correct time object
    """
    def _deserialize(self, value, attr, data, **kwargs):
        if isinstance(value, dt.time):
            return value
        if isinstance(value, float):
            value = round(value)
        if isinstance(value, int):
            return dt.time(hour=value//60, minute=value % 60)
        return super()._deserialize(value, attr, data)
