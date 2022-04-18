import abc
import re
from typing import Type
import datetime
from marshmallow import Schema, INCLUDE
from marshmallow.fields import String, Integer, Boolean, Float
from pandas import read_excel, notnull
from backend.extensions import (
    TimeValidation as Time,
    DateValidation as Date,
    validate_terminal,
    validate_truck_type
)
from backend.models import Order, Truck, OrderSheet, TruckSheet
from backend.plugins import db


class TruckAvailabilitySchema(Schema):
    """
    The required contents of the truck availability sheet.

    On top of type checking, the schema will also validate that
    the truck_type string is one of 'terminal', 'regional' or 'port' and
    that the terminal string is one of 'ITV', 'KAT' or 'OSS'.

    Any additional columns in the data will also be parsed,
    but will not be tested against a type.
    """

    truck_id = String(data_key='Truck ID', required=True)
    availability = Boolean(data_key='Availability of truck', required=True)
    truck_type = String(data_key='Truck type', required=True,
                        validate=validate_truck_type)
    business_type = String(data_key='business Type')
    terminal = String(data_key='Terminal Base', required=True,
                      validate=validate_terminal)
    hierarchy = Float(data_key='Truck Hierarchy', required=True)
    use_cost = Float(data_key='Truck Use Cost', required=True)
    date = Date(data_key='Date', required=True)
    starting_time = Time(data_key='Starting time', required=True)

    class Meta:
        """
        Defines that columns which are not defined are included.
        """
        unknown = INCLUDE


class OrderListSchema(Schema):
    """
    The required contents of the order list sheet.

    On top of type checking, the schema will also validate that
    the truck_type string is one of 'terminal', 'regional' or 'port' and
    that the inl_terminal string is one of 'ITV', 'KAT' or 'OSS'.

    Any additional columns in the data will also be parsed,
    but will not be tested against a type.
    """
    inl_terminal = String(data_key='Inl* ter*', required=True,
                          validate=validate_terminal)
    truck_type = String(data_key='truck type', required=True,
                        validate=validate_truck_type)
    hierarchy = Float(data_key='Hierarchy', required=True)
    delivery_deadline = Time(data_key='Delivery Deadline', required=True)
    driving_time = Integer(data_key='driving time', required=True)
    process_time = Integer(data_key='proces time', required=True)

    class Meta:
        """
        Defines that columns which are not defined are included.
        """
        unknown = INCLUDE


class SheetParser(abc.ABC):
    """
    Base class for parsing spreadsheet files and validating them.

    :param file: The spreadsheet file.
    :type file: :class:`Werkzeug.FileStorage`, alternatively, a file like
                object that is supported by :meth:`Pandas.read_excel`
    """

    unique_columns: set
    """Set of column names in which the values need to be unique."""
    required_columns: set
    """Set of column names in which all values are required."""
    ignored_columns: set
    """Set of column names which will be ignored."""
    schema: Type[Schema]
    """:class:`marshmallow.Schema` which validates the data
    on typing and missing values."""
    sheet_table: Type[db.Model]
    """:class:`flask_sqlalchemy.Model` Table that stores the data sheets"""
    row_table: Type[db.Model]
    """:class:`flask_sqlalchemy.Model`
    Table that stores the rows of the data sheets"""

    def __init__(self, file, *args, **kwargs):
        """Constructor method"""
        self.dataframe = self.get_dataframe(file, *args, **kwargs)

    def check_required_columns(self):
        """
        Checks for each required column in `required_columns` if it is present
        is the excel sheet.

        :return: The names of the columns that are missing.
        :rtype: set
        """
        return self.required_columns.difference(self.dataframe.columns)

    def check_unique_columns(self):
        """
        Checks for each unique column in `unique_columns` if the values in the
        column are unique.

        :return: The names of the columns that contain duplicate values.
        :rtype: set
        """
        not_unique = set()
        for column in self.unique_columns:
            if not self.dataframe[column].is_unique:
                not_unique.add(column)
        return not_unique

    def parse(self):
        """
        Parses and validates the data from the file into a `List[dict]`.

        This list contains a dictionary for each row. In case the data of the
        spreadsheet can be converted to an internal Python object, the
        data will get converted.

        The dictionary of each row has keys for each column that has been
        parsed. The value belonging to that key is the value of that column
        in the row of the dictionary.

        :raises :class:`marshmallow.exceptions.ValidationError`:
                  If the Marshmallow validation failed.
        :return: The data that has been parsed and validated.
        :rtype: `List[dict]`
        """
        data_dict = [{k: self.convert_time(v)
                      for k, v in row.items() if notnull(v)}
                     for row in self.dataframe.to_dict(orient='records')]
        return self.post_parse(self.schema(many=True).load(data_dict))

    @classmethod
    def get_dataframe(cls, file, *args, **kwargs):
        """
        Converts the data in `file` to a `:class:Pandas.DataFrame`.

        :param file: The file to be parsed.
        :type file: :class:`werkzeug.FileStorage`, alternatively, a file like
                object that is supported by :meth:`pandas.read_excel`
        :param args: Additional arguments to send to :meth:`Pandas.read_excel`.
        :param kwargs: Additional keyword arguments to send
                       to :meth:`pandas.read_excel`
        :raises :class:`xldr.XLDRError`: if `file` is not a spreadsheet file.
        :return: A :class:`pandas.DataFrame` containing the data from `file`.
        :rtype: :class:`pandas.DataFrame`
        """
        # Parse the sheet file as a dataframe
        raw_df = read_excel(file,
                            *args, **kwargs)

        # Find the header row
        if not raw_df.columns.str.contains('Unnamed').all():
            df = raw_df
        else:
            # Find the first non-empty row, and use it as the header row
            for i, row in raw_df.iterrows():
                if row.notnull().all():
                    # Non-emtpy row was found
                    df = raw_df.iloc[(i + 1):].reset_index(drop=True)
                    df.columns = list(raw_df.iloc[i])
                    break
            else:
                # No header row was found, just return the raw dataframe
                # All columns will be 'marked' as missing
                return cls.post_dataframe(raw_df)

        # Remove the columns that should be ignored
        df.drop(cls.ignored_columns, errors='ignore', axis=1, inplace=True)

        # Rename duplicate rows
        seen = dict()
        new_columns = []

        for c in df.columns:
            if c in seen:
                seen[c] += 1
                new_columns.append(f'{c} ({seen[c]})')
            else:
                seen[c] = 0
                new_columns.append(c)
        df.columns = new_columns

        return cls.post_dataframe(df)

    @staticmethod
    def post_dataframe(dataframe):
        """
        Template method to edit the dataframe before parsing for sub classes.

        :param dataframe: Result of reading `file` using pandas
        :type dataframe: :class:`pandas.DataFrame`
        :return: The (edited) dataframe
        :rtype: :class:`pandas.DataFrame`
        """
        return dataframe

    @staticmethod
    def post_parse(data):
        """
        Template method to edit the parsed data.

        :param data: The parsed data
        :type data: List[Dict]
        :return: The (edited) data
        :rtype: List[Dict]
        """
        return data

    @staticmethod
    def convert_time(value):
        if isinstance(value, datetime.time):
            return value.strftime('%H:%M')
        return value


class TruckAvailabilityParser(SheetParser):
    """
    Parses the truck availability sheet.
    """
    unique_columns = {'Truck ID'}
    required_columns = {'Truck ID', 'Availability of truck',
                        'Truck type', 'Terminal Base', 'Truck Hierarchy',
                        'Truck Use Cost', 'Starting time', 'Date'}
    ignored_columns = {'Truck S No'}
    schema = TruckAvailabilitySchema
    sheet_table = TruckSheet
    row_table = Truck


class OrderListParser(SheetParser):
    """
    Parses the order list sheet.
    """
    unique_columns = {}
    required_columns = {'Inl* ter*',
                        'truck type', 'Hierarchy', 'Delivery Deadline',
                        'driving time', 'proces time'}
    ignored_columns = {'Order Number', 'service time', 'Latest Dep Time'}
    schema = OrderListSchema
    sheet_table = OrderSheet
    row_table = Order

    def __init__(self, file):
        super().__init__(file)

    @staticmethod
    def post_dataframe(dataframe):
        # Replace '.' with another character, as Marshmallow thinks that
        # a key, value item 'a.b': 'c' means {'a': {'b': 'c'}}
        dataframe.columns = [re.sub(r'[.]', '*', i) for i in dataframe.columns]
        return dataframe

    @staticmethod
    def post_parse(data):
        # Change back the replaced character in :meth:`post_dataframe`
        # to '.'
        for i in data:
            # Keys are the old column names, values are the new column names
            key_replacements = {}

            # Find new column names
            for key in i.keys():
                new_name = re.sub(r'[*]', r'.', key)
                key_replacements[key] = new_name

            # Replace old column names
            for key, new_name in key_replacements.items():
                i[new_name] = i.pop(key)

        return data
