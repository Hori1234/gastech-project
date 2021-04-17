from flask import current_app
from marshmallow import ValidationError


def validate_truck_type(val):
    """
    Validates the truck type input.

    Raises a `ValidationError` if val is not one of 'terminal', 'regional'
    or 'port'. This check is case insensitive.

    :param val: the value of the column.
    :type val: str
    :raises :class:`marshmallow.exceptions.ValidationError`: if
            `val.lower()` is not `terminal`, `regional` or `port`.
    """
    trucks = current_app.config['TRUCK_TYPES']
    if val.lower() not in trucks:
        raise ValidationError(
            f"Truck type must be one of {', '.join(trucks[:-1])} "
            f"or {trucks[-1]}"
        )


def validate_terminal(val):
    """
    Validates the terminal input.

    Raises a `ValidationError` if val is not one of 'KAT', 'ITV'
    or 'OSS'. This check is case insensitive.

    :param val: the value of the column.
    :type val: str
    :raises :class:`marshmallow.exceptions.ValidationError`: if
    `val.lower()` is not `itv`, `kat` or `oss`.
    """
    terminals = current_app.config['TERMINALS']
    if val.upper() not in terminals:
        raise ValidationError(
            f"Terminal base must be one of {', '.join(terminals[:-1])} "
            f"or {terminals[-1]}"
        )
