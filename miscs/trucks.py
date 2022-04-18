import datetime
from sqlalchemy.ext.associationproxy import association_proxy
from backend.plugins import db
from .mixins.ValidationMixin import ValidationMixin
from .properties import TruckProperties


class Truck(ValidationMixin, db.Model):
    """
    A single row in a truck availability sheet.

    The columns are all required to create a planning. The non-required columns
    are stored in the others relation with
    :class:`backend.models.TruckProperties`.
    """
    s_number = db.Column(db.Integer, primary_key=True)
    sheet_id = db.Column(db.Integer,
                         db.ForeignKey('truck_sheet.id', ondelete='CASCADE'))
    truck_id = db.Column(db.String, nullable=False)
    availability = db.Column(db.Boolean, nullable=False)
    truck_type = db.Column(db.String, nullable=False)
    business_type = db.Column(db.String, nullable=False)
    terminal = db.Column(db.String, nullable=False)
    hierarchy = db.Column(db.Float, nullable=False)
    use_cost = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)
    starting_time = db.Column(db.Time, nullable=False)

    # The `others` field is for every property that is not required.
    others = association_proxy('properties',
                               'value',
                               creator=lambda k, v:
                               TruckProperties(key=k, value=v))

    # The orders assigned to this particular truck
    orders = db.relationship('Order', backref='truck')

    def __init__(self, truck_id: str, availability: bool,
                 truck_type: str, business_type: str, terminal: str,
                 hierarchy: float, use_cost: float, date: datetime.date,
                 starting_time: datetime.time, sheet_id: int = None, **kwargs):
        self.sheet_id = sheet_id
        self.truck_id = truck_id
        self.availability = availability
        self.truck_type = truck_type
        self.business_type = business_type
        self.terminal = terminal
        self.hierarchy = hierarchy
        self.use_cost = use_cost
        self.date = date
        self.starting_time = starting_time
        self.others = kwargs

    def assign_orders(self, orders, departure_times):
        """
        Assigns a list of orders to this truck,
        departure time has to be included.

        :param orders: List of order objects to be assigned to this truck
        :type orders: List[:class:`backend.models.Order`]
        :param departure_times: List of departure times for the orders.
        :type departure_times: List[str]
        """
        for order, departure_time in zip(orders, departure_times):
            order.truck = self
            order.departure_time = departure_time
