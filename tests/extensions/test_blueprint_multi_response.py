"""
Test the blueprint_multi_response functionality.

The blueprint_multi_response is extended from :class:`flask_smorest.Blueprint`.
It provides an extra method, :meth:`Blueprint.alt_response`, to document a
response that should not be dumped into a marshmallow schema.

See https://github.com/marshmallow-code/flask-smorest/pull/163#issuecomment-683859754
for the initial idea and discussion.

These tests are mostly copied and changed from the Flask Smorest test_blueprint
tests. The documentation is not checked for OpenAPI version 2.0, as we don't
use it.

"""

import pytest
import http
import marshmallow as ma
from tests.conftest import TestingConfig
from flask import Flask, jsonify
from flask_smorest import Api
from apispec.utils import build_reference
from backend.extensions import Blueprint


@pytest.fixture
def api():
    app = Flask(__name__)
    app.config.from_object(TestingConfig)
    return Api(app)


@pytest.fixture
def schema():
    class DocSchema(ma.Schema):
        item_id = ma.fields.Int(dump_only=True)
        field = ma.fields.Int()

    return DocSchema


def build_ref(component, obj):
    return build_reference(component, 3, obj)


def test_blueprint_response_many(api, schema):
    bp = Blueprint('test', 'test', url_prefix='/test')

    @bp.route('/single')
    @bp.response(schema)
    def single():
        pass

    @bp.route('/many')
    @bp.response(schema(many=True))
    def many():
        pass

    api.register_blueprint(bp)

    paths = api.spec.to_dict()['paths']

    schema_ref = build_ref('schema', 'Doc')

    response = paths['/test/single']['get']['responses']['200']
    assert (
            response['content']['application/json']['schema'] ==
            schema_ref
    )

    response = paths['/test/many']['get']['responses']['200']
    assert (
            response['content']['application/json']['schema']['items'] ==
            schema_ref
    )


def test_blueprint_response_description(api):
    bp = Blueprint('test', 'test', url_prefix='/test')

    @bp.route('/no_desc')
    @bp.response(code=204)
    def func_1():
        pass

    @bp.route('/desc')
    @bp.response(code=204, description='Test')
    def func_2():
        pass

    api.register_blueprint(bp)

    get_1 = api.spec.to_dict()['paths']['/test/no_desc']['get']
    assert (
            get_1['responses']['204']['description'] ==
            http.HTTPStatus(204).phrase
    )

    get_2 = api.spec.to_dict()['paths']['/test/desc']['get']
    assert get_2['responses']['204']['description'] == 'Test'


def test_blueprint_alt_response(api):
    bp = Blueprint('test', 'test', url_prefix='/test')

    @bp.route('/')
    @bp.response(code=200)
    @bp.alt_response('BAD_REQUEST', code=400)
    def func():
        pass

    api.register_blueprint(bp)
    spec = api.spec.to_dict()['paths']['/test/']['get']

    assert '200' in spec['responses']
    assert '400' in spec['responses']
    assert 'default' in spec['responses']
    assert (
        spec['responses']['400'] ==
        build_ref('response', 'BAD_REQUEST')
    )
    assert (
        spec['responses']['default'] ==
        build_ref('response', 'DEFAULT_ERROR')
    )


def test_blueprint_response_example(api):
    bp = Blueprint('test', 'test', url_prefix='/test')

    examples = {
        'example 1': {'name': 'Rick'},
        'example 2': {'name': 'Something else'}
    }

    @bp.route('/single')
    @bp.response(example=examples['example 1'])
    def single():
        pass

    @bp.route('/multiple')
    @bp.response(examples=examples)
    def multiple():
        pass

    api.register_blueprint(bp)

    single = api.spec.to_dict()['paths']['/test/single']['get']

    assert (
            single['responses']['200']['content']['application/json']['example']
            == examples['example 1']
    )

    multiple = api.spec.to_dict()['paths']['/test/multiple']['get']
    assert (
            multiple['responses']['200']['content'][
                'application/json']['examples'] == examples
    )


def test_blueprint_response_headers(api):
    bp = Blueprint('test', 'test', url_prefix='/test')

    headers = {'Set-Cookie': {'description': 'Sets the auth cookie'}}

    @bp.route('/')
    @bp.response(headers=headers)
    def func():
        pass

    api.register_blueprint(bp)

    get = api.spec.to_dict()['paths']['/test/']['get']
    assert get['responses']['200']['headers'] == headers


def test_blueprint_pagination(api, schema):
    bp = Blueprint('test', __name__, url_prefix='/test')

    @bp.route('/')
    @bp.arguments(schema, location='query')
    @bp.paginate()
    def func():
        pass

    api.register_blueprint(bp)
    spec = api.spec.to_dict()

    # Check parameters are documented
    parameters = spec['paths']['/test/']['get']['parameters']

    # Page
    assert parameters[1]['name'] == 'page'
    assert parameters[1]['in'] == 'query'
    assert parameters[1]['schema']['type'] == 'integer'
    assert parameters[1]['schema']['default'] == 1
    assert parameters[1]['schema']['minimum'] == 1

    # Page size
    assert parameters[2]['name'] == 'page_size'
    assert parameters[2]['in'] == 'query'
    assert parameters[2]['required'] is False
    assert parameters[2]['schema']['type'] == 'integer'
    assert parameters[2]['schema']['default'] == 10
    assert parameters[2]['schema']['minimum'] == 1
    assert parameters[2]['schema']['maximum'] == 100


def test_blueprint_response_werkzeug_response(api, schema):
    bp = Blueprint('test', 'test', url_prefix='/test')
    client = api._app.test_client()

    @bp.route('/response')
    @bp.response(schema)
    def func():
        return jsonify({'test': 'test'}), 201, {'X-header': 'test'}

    api.register_blueprint(bp)

    rv = client.get('/test/response')
    assert rv.status_code == 201
    assert rv.status == '201 CREATED'
    assert rv.json == {'test': 'test'}
    assert rv.headers['X-header'] == 'test'
