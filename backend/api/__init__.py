def register_api(api):
    """
    Registers all blueprint to the API.

    Also adds the security scheme to the API documentation.

    :param api: The API flask plugin
    :type api: :class:`flask_smorest.Api`
    """

    # import all blueprints
    # this is done in the function to prevent cycled imports
    from .auth import bp as auth_bp

    # register all blueprints
    api.register_blueprint(auth_bp, url_prefix='/api/auth/')


    # document security scheme of the API (for the OpenAPI 3.0+ spec)
    api.spec.components.security_scheme(
        "cookieAuth", {"type": "apiKey",
                       "description":
                           "This API can be accessed using "
                           "cookie authentication with a basic login",
                       "in": "cookie",
                       "name": "session"
                       }
    )
