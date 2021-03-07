from marshmallow import ValidationError
from backend.app import db
from backend.extensions import validate_terminal, validate_truck_type


class ValidationMixin(object):

    @db.validates('terminal', 'inl_terminal')
    def validate_terminal(self, key, value):
        """
        Validates terminal field.

        Calls :meth:`backend.extensions.validate_terminal`.
        If a :class:`marshmallow.ValidationError` is thrown, it is transformed
        into a ValueError.

        :param key: either `terminal` or `inl_terminal`
        :type key: str
        :param value: value stored in the `key` attribute
        :type value: str
        :raises :class:`ValueError`: if ValidationError is raised
        :return: `value.upper()`
        :rtype: str
        """
        try:
            validate_terminal(value)
            return value.upper()
        except ValidationError as e:
            raise ValueError(e.normalized_messages())

    @db.validates('truck_type')
    def validate_truck_type(self, key, value):
        """
        Validates truck type.

        Calls :meth:`backend.extensions.validate_terminal`.
        If a :class:`marshmallow.ValidationError` is thrown, it is transformed
        into a ValueError.

        :param key: will always be `truck_type`
        :type key: str
        :param value: value set in the `truck_type` field
        :type value: str
        :raises :class:`ValueError`: if ValidationError is raised
        :return: `value.lower()`
        :rtype: str
        """
        try:
            validate_truck_type(value)
            return value.lower()
        except ValidationError as e:
            raise ValueError(e.normalized_messages())
