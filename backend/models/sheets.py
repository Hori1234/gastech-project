from flask_sqlalchemy import BaseQuery
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.sql import func
from flask import abort
from backend.plugins import db
from .trucks import Truck
from .orders import Order
from .properties import TruckProperties, OrderProperties
from .planning import Planning


class SheetQuery(BaseQuery):
    """
    Extends the base query to implement getting
    a sheet using an integer ID or a string `latest`.
    """

    def get_sheet_or_404(self, id_or_str, view_only=False):
        """
        In case of an ID, the query will call
        :meth:`flask_sqlalchemy.BaseQuery.get_or_404`.

        In case of a string `latest`, the query will return the sheet with
        the latest upload date.

        Otherwise, a 404 error will be returned.

        :param id_or_str: ID of the sheet or a string specifying
        which sheet to get.
        :type id_or_str: str or int
        :param view_only: Whether the user which made the request
        cannot see published plannings.
        :return: The sheet which was requested
        """
        # Get the class queried from
        model = self._joinpoint_zero().class_

        try:
            # Try to parse the id as an int and get the sheet
            sheet = self.get_or_404(int(id_or_str))

            # View only users can only see sheets that have been published
            if view_only and sheet.planning is None:
                return abort(404)

            return sheet

        except ValueError:
            # The id is not an integer, so check if it is `latest`
            if id_or_str == 'latest':
                # Get the most recently uploaded sheet
                sheet = self.order_by(model.upload_date.desc())

                if view_only:
                    sheet = sheet.join(Planning)

                return sheet.first_or_404()
            else:
                # Can't understand which sheet is requested
                abort(404)


class SheetMixin(object):
    """
    Mixin to add the common columns used by both
    :class:`backend.models.TruckSheet` and :class`backend.models.OrderSheet`.
    """
    query_class = SheetQuery

    id = db.Column(db.Integer, primary_key=True)
    upload_date = db.Column(db.DateTime, server_default=func.now())


class TruckSheet(SheetMixin, db.Model):
    """
    Model for the truck availability sheet in the database.
    """

    trucks = db.relationship('Truck', backref='truck_sheet',
                             cascade='all, delete-orphan')

    @hybrid_property
    def column_names(self):
        """
        Gets the names of all columns of the order sheet
        for this row.
        """
        property_names = TruckProperties.query.\
            with_entities(TruckProperties.key).join(Truck)\
            .filter(Truck.sheet_id == self.id).distinct().all()
        property_names = {name: name for name, in property_names}
        standard_names = {'s_number': 'S Number',
                          'truck_id': 'Truck ID',
                          'availability': 'Availability',
                          'truck_type': 'Truck type',
                          'business_type': 'Business type',
                          'terminal': 'Terminal',
                          'hierarchy': 'Hierarchy',
                          'use_cost': 'Use cost',
                          'date': 'Date',
                          'starting': 'Starting time'}
        return {**standard_names, **property_names}

    def add_row(self, truck):
        """
        Adds a truck to the database
        """
        self.trucks.append(truck)

    def add_rows(self, rows):
        """
        Adds one or more rows to all trucks
        """
        self.trucks.extend(rows)


class OrderSheet(SheetMixin, db.Model):
    """
    Model for the truck availability sheet in the database.
    """

    orders = db.relationship('Order', backref='order_sheet',
                             cascade='all, delete-orphan')

    @hybrid_property
    def column_names(self):
        """
        Gets the names of all columns of the truck availability sheet
        for this row.
        """
        property_names = OrderProperties.query. \
            with_entities(OrderProperties.key).join(Order) \
            .filter(Order.sheet_id == self.id).distinct().all()
        property_names = {name: name for name, in property_names}
        standard_names = {'order_number': 'Order Number',
                          'truck_type': 'Truck type',
                          'truck_id': 'Truck ID',
                          'inl_terminal': 'Terminal',
                          'departure_time': 'Departure time',
                          'driving_time': 'Driving time',
                          'process_time': 'Process time',
                          'service_time': 'Service time',
                          'latest_dep_time': 'Latest departure time'
                          }
        return {**standard_names, **property_names}

    def add_row(self, order):
        """
        Adds an order to the database
        """
        self.orders.append(order)

    def add_rows(self, rows):
        """
        Adds one or more rows to all orders
        """
        self.orders.extend(rows)
