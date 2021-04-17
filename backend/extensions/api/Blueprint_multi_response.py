from copy import deepcopy
from functools import wraps
import http

from werkzeug.wrappers import BaseResponse
from flask import jsonify

from flask_smorest.utils import (
    deepupdate, get_appcontext,
    unpack_tuple_response, set_status_and_headers_in_response
)

from flask_smorest import Blueprint as _Blueprint


class Blueprint(_Blueprint):
    """
    Overrides the flask_smorest Blueprint's response method to be able
    to decorate a route with multiple response methods.
    """

    def response(
            self, schema_or_ref=None, *, code=200, description=None,
            example=None, examples=None, headers=None, alt_response=False
    ):
        """Decorator generating an endpoint response

        :param schema_or_ref: Either a :class:`Schema <marshmallow.Schema>`
            class or instance or a string error reference.
            When passing a reference, arguments below are ignored.
        :param int|str|HTTPStatus code: HTTP status code (default: 200).
            Used if none is returned from the view function.
        :param str description: Description of the response (default: None).
        :param dict example: Example of response message.
        :param list examples: Examples of response message.
        :param dict headers: Headers returned by the response.
        :param bool alt_response: Whether this is the main response decorator

        The decorated function is expected to return the same types of value
        than a typical flask view function, except the body part may be an
        object or a list of objects to serialize with the schema, rather than
        a ``string``.

        If the decorated function returns a ``Response`` object, the ``schema``
        and ``code`` parameters are only used to document the resource.

        The `example` and `examples` parameters are mutually exclusive. The
        latter should only be used with OpenAPI 3.

        The `example`, `examples` and `headers` parameters are only used to
        document the resource.

        The `alt_response` flag determines whether the response is used for
        serialization or only for documentation.

        Modified from Flask-Smorest's Blueprint to include
        https://github.com/marshmallow-code/
        flask-smorest/pull/163#issuecomment-683859754

        See :doc:`Response <response>`.
        """
        # If a ref is passed
        if isinstance(schema_or_ref, str):
            doc = {'responses': {code: schema_or_ref}}
        # If a schema is passed
        else:
            schema = schema_or_ref
            if isinstance(schema, type):
                schema = schema()

            # Document response (schema, description,...) in the API doc
            resp_doc = {}
            doc_schema = self._make_doc_response_schema(schema)
            if doc_schema is not None:
                resp_doc['schema'] = doc_schema
            if description is not None:
                resp_doc['description'] = description
            else:
                resp_doc['description'] = http.HTTPStatus(int(code)).phrase
            if example is not None:
                resp_doc['example'] = example
            if examples is not None:
                resp_doc['examples'] = examples
            if headers is not None:
                resp_doc['headers'] = headers
            doc = {'responses': {code: resp_doc}}

        def decorator(func):

            @wraps(func)
            def wrapper(*args, **kwargs):

                # If this decorator is used for as an alternative response,
                # return without serializing
                if alt_response:
                    return func(*args, **kwargs)

                # Execute decorated function
                result_raw, status, headers = unpack_tuple_response(
                    func(*args, **kwargs))

                # If return value is a werkzeug BaseResponse, return it
                if isinstance(result_raw, BaseResponse):
                    set_status_and_headers_in_response(
                        result_raw, status, headers)
                    return result_raw

                # Dump result with schema if specified
                if schema is None:
                    result_dump = result_raw
                else:
                    result_dump = schema.dump(result_raw)

                # Store result in appcontext (may be used for ETag computation)
                appcontext = get_appcontext()
                appcontext['result_raw'] = result_raw
                appcontext['result_dump'] = result_dump

                # Build response
                resp = jsonify(self._prepare_response_content(result_dump))
                set_status_and_headers_in_response(resp, status, headers)
                if status is None:
                    resp.status_code = code

                return resp

            # Store doc in wrapper function
            # The deepcopy avoids modifying the wrapped function doc
            wrapper._apidoc = deepcopy(getattr(wrapper, '_apidoc', {}))
            wrapper._apidoc['response'] = deepupdate(
                wrapper._apidoc.get('response', {}),
                doc
            )

            # Document default error response if it's not already there
            if not alt_response:
                wrapper._apidoc['response']['responses']['default'] = \
                    'DEFAULT_ERROR'

                # Indicate which code is the success status code
                # Helps other decorators documenting success response
                wrapper._apidoc['success_status_code'] = code

            return wrapper

        return decorator

    def alt_response(self, *args, **kwargs):
        """
        Convenience method to add alternative responses to a view function.

        Alternative responses are documented, but are not serialized when
        returned from the view function.
        """
        return self.response(*args, **kwargs, alt_response=True)
