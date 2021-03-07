from backend.plugins import ma
from backend.models import Planning


class PlanningSchema(ma.SQLAlchemyAutoSchema):
    """
    Serializes a :class:`backend.models.Planning` object to JSON.
    """

    class Meta:
        """
        Determines which fields are in the schema.
        """
        model = Planning
        include_fk = True
