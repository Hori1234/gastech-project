from backend.plugins import ma
from marshmallow import INCLUDE, post_dump
from backend.models import Order, OrderSheet


class OthersSchemaMixin(object):
    """
    Mixin for schemas to extend from, adds the functionality that the `others`
    field is unpacked in the dumped object.
    """

    @post_dump
    def flatten_others(self, obj, many, **kwargs):
        """
        Flattens the others field of an order
        """
        for k, v in obj['others'].items():
            obj[k] = v

        # remove the others field from the object
        obj.pop('others')
        return obj


class TruckIDSchema(ma.Schema):
    """
    Serializes the truck_id field from a :class:`Backend.models.Truck`.
    """
    truck_id = ma.String()


class OrderSchema(OthersSchemaMixin, ma.SQLAlchemyAutoSchema):
    """
    Serializes the :class:`backend.models.Order` database table to JSON.
    """

    latest_dep_time = ma.Time()
    service_time = ma.Integer()
    truck_id = ma.Pluck(TruckIDSchema,
                        'truck_id',
                        attribute='truck',
                        dump_only=True)
    truck_s_number = ma.Integer(allow_none=True, load_only=True)
    others = ma.Dict(dump_only=True)

    class Meta:
        """
        Determines the database table from which the fields are inferred from.
        Also determines the order and includes the unknown fields in the
        loaded and dumped objects.
        """
        model = Order
        ordered = True
        dump_only = ('order_number',
                     'latest_dep_time',
                     'service_time')
        unknown = INCLUDE


class OrderTableSchema(ma.SQLAlchemySchema):
    """
    Serializes a :class:`backend.models.OrderSheet` including
    the columns names to JSON.
    """

    orders = ma.Nested(OrderSchema, many=True)
    column_names = ma.Dict()

    class Meta:
        """
        Determines the inferred fields of the schema.
        """
        model = OrderSheet


class TimeLineSchemaOthers(ma.Schema):
    """
    Serializes the parameters stored in the others relation
    (from :class:`backend.models.OrderProperties`) for the planning timeline.
    """
    container_id = ma.String(default=None, attribute='Container')
    address = ma.String(default=None, attribute='Address')
    booking_id = ma.String(default=None, attribute='Booking')
    client = ma.String(default=None, attribute='Client')


class TimeLineSchema(OthersSchemaMixin, ma.SQLAlchemySchema):
    """
    Serializes the parameters needed for the planning timeline.
    """
    truck_id = ma.Pluck(TruckIDSchema, 'truck_id', attribute='truck')
    departure_time = ma.Time()
    end_time = ma.Time()
    others = ma.Nested(TimeLineSchemaOthers)
    order_type = ma.String(attribute='truck_type')

    class Meta:
        """
        Determines the inferred fields on the schema.
        """
        model = Order
