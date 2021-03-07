from flask_smorest import Api
from apispec.ext.marshmallow import common, MarshmallowPlugin
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate


def custom_name_resolver(schema):
    """
    Creates names for Marshmallow schemas in documentation.

    In case a schema is created using partial=`True`, `Partial-`
    will be added in front of the its name.

    In case a schema name ends with `Schema`, the `Schema` part
    is removed from the name.

    Adapted from https://github.com/marshmallow-code/apispec/pull/476/

    :param schema: Schema to name
    :type schema: `marshmallow.Schema`
    :return: The documented name for the schema
    :rtype: str
    """
    # Get an instance of the schema
    schema_instance = common.resolve_schema_instance(schema)
    if schema_instance.partial:
        prefix = "Patch-"
    elif schema_instance.only:
        prefix = "Partial-"
    else:
        prefix = ""

    # Get the class of the instance
    schema_cls = common.resolve_schema_cls(schema)
    name = prefix + schema_cls.__name__

    if name.endswith("Schema"):
        return name[:-6] or name
    return name


db = SQLAlchemy()
api = Api(
    spec_kwargs={
        'marshmallow_plugin': MarshmallowPlugin(
            schema_name_resolver=custom_name_resolver
        )
    }
)
ma = Marshmallow()
login = LoginManager()
migrate = Migrate()
