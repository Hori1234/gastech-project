from sqlalchemy.orm.collections import attribute_mapped_collection
from backend.plugins import db


class PropertiesMixin(object):
    """
    Adds a key-value pair to a model. This is used in both the
    TruckProperties and the OrderProperties
    """
    key = db.Column(db.String, primary_key=True)
    value = db.Column(db.String, nullable=False)


class TruckProperties(PropertiesMixin, db.Model):
    """
    Makes a relation from a truck to a key value pair.

    This is used to store any dynamic information that needs to be stored
    next to the required columns of the :class:`backend.models.Truck` model.
    """
    s_number = db.Column(db.Integer,
                         db.ForeignKey('truck.s_number',
                                       ondelete='CASCADE'),
                         primary_key=True)

    # The relationship from truck to truck_properties is set to be usable as
    # a Python dictionary object
    truck = db.relationship('Truck', backref=db.backref(
                'properties',
                collection_class=attribute_mapped_collection('key'),
                cascade='all, delete-orphan'))


class OrderProperties(PropertiesMixin, db.Model):
    """
    Makes a relation from an order to a key value pair.

    This is used to store any dynamic information that needs to be stored
    next to the required columns of the :class:`backend.models.Order` model.
    """
    order_number = db.Column(db.Integer,
                             db.ForeignKey('order.order_number',
                                           ondelete='CASCADE'),
                             primary_key=True)

    # The relationship from order to order_properties is set to be usable as
    # a Python dictionary object
    order = db.relationship('Order', backref=db.backref(
        'properties',
        collection_class=attribute_mapped_collection('key'),
        cascade='all, delete-orphan'))
