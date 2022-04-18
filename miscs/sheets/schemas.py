from backend.plugins import ma
from backend.models import OrderSheet
from flask_smorest.fields import Upload


class FileSchema(ma.Schema):
    """
    Parameters for the schema file upload.
    """
    file_1 = Upload(required=True)


class SheetSchema(ma.SQLAlchemyAutoSchema):
    """
    Serializes :class:`backend.models.OrderSheet` to JSON.
    """

    class Meta:
        """
        Determines which fields are in the schema.
        """
        model = OrderSheet
