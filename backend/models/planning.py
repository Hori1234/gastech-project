from sqlalchemy import func
from backend.plugins import db
from .users import User


class Planning(db.Model):
    """
    A published planning.

    This model links between an order sheet and truck availability sheet.
    """

    order_sheet_id = db.Column(db.Integer,
                               db.ForeignKey('order_sheet.id'),
                               primary_key=True)
    truck_sheet_id = db.Column(db.Integer,
                               db.ForeignKey('truck_sheet.id'),
                               primary_key=True)
    published_on = db.Column(db.DateTime, server_default=func.now())
    user_id = db.Column(db.Integer,
                        db.ForeignKey(User.id))

    order_sheet = db.relationship('OrderSheet',
                                  backref=db.backref(
                                      'planning',
                                      cascade='all, delete-orphan',
                                      uselist=False))
    truck_sheet = db.relationship('TruckSheet',
                                  backref=db.backref(
                                      'planning',
                                      cascade='all, delete-orphan',
                                      uselist=False))
    user = db.relationship(User,
                           backref=db.backref('plannings'))

    def __init__(self, truck_sheet_id, order_sheet_id,  user_id):
        # The publishing time is calculated automatically,
        # while the other three properties are taken as inputs
        self.truck_sheet_id = truck_sheet_id
        self.order_sheet_id = order_sheet_id
        self.user_id = user_id
