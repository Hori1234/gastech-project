from flask.views import MethodView
from flask_smorest import abort
from xlrd import XLRDError
from marshmallow.exceptions import ValidationError
from .schemas import FileSchema, SheetSchema
from .SheetParser import TruckAvailabilityParser, OrderListParser
from backend.plugins import db
from backend.models import OrderSheet, TruckSheet
from backend.extensions import Blueprint, roles_required

bp = Blueprint('sheets',
               'sheets',
               description='Upload and parse sheets')


@bp.route('/')
class Sheets(MethodView):

    @roles_required('planner', 'administrator')
    @bp.arguments(FileSchema, location='files')
    @bp.response(SheetSchema, code=200)
    @bp.alt_response("BAD_REQUEST", code=400)
    def post(self, file):
        """
        Parses the orders and truck availability sheets files.
        """
        file_1 = file.pop('file_1')  # file_1 is required, so is always here

        try:
            missing_columns = None  # stores the missing columns of a parser

            for Parser in (TruckAvailabilityParser,  # pragma: no branch
                           OrderListParser):

                parser = Parser(file_1)  # instantiate the parser

                # Check if all required columns are in the excel sheet
                if len(parser.check_required_columns()) != 0:

                    if missing_columns:
                        # If the second parser also failed to parse

                        # Find the parser with the least missing columns
                        if len(parser.check_required_columns()) \
                                < len(missing_columns):
                            missing_columns = parser.check_required_columns()

                        # If there are 5 or more missing columns, we report
                        # that we didn't recognize the spreadsheet
                        if len(missing_columns) >= 5:
                            abort(400,
                                  message="Spreadsheet is not recognized.",
                                  status="Bad Request")

                        # If there are less than 5 columns missing, we report
                        # the missing columns.
                        else:
                            abort(422,  # pragma: no branch
                                  errors={i: "Column is missing."
                                          for i in missing_columns},
                                  status="Unprocessable Entity"
                                  )
                    else:
                        # store the missing columns and try the next parser
                        missing_columns = parser.check_required_columns()
                        continue

                # check if the unique columns contain duplicate values
                if len(parser.check_unique_columns()) != 0:
                    abort(422,  # pragma: no branch
                          errors={i: "Column contains duplicate values."
                                  for i in parser.check_unique_columns()},
                          status="Unprocessable Entity"
                          )

                # parse the data using a Marshmallow schema
                data = parser.parse()

                sheet = parser.sheet_table()
                orders = [parser.row_table(**row) for row in data]
                sheet.add_rows(orders)
                db.session.add(sheet)
                db.session.commit()
                return sheet, 200

        except XLRDError:
            # The file could not be read by the spreadsheet parser
            abort(400,
                  message="File type not supported."
                  )
        except ValidationError as e:
            # The data in the spreadsheet does not have the right type
            # or is missing
            abort(
                422,
                errors=e.normalized_messages(),
                status="Unprocessable Entity"
            )


class ListSheet(MethodView):

    @roles_required('planner', 'administrator')
    @bp.response(SheetSchema(many=True))
    @bp.alt_response('UNAUTHORIZED', code=401)
    @bp.alt_response('NOT_FOUND', code=404)
    def get(self, table, pagination_parameters):
        """
        Queries a list of objects from `table`, paginated
        using `pagination_parameters`.
        :param table: Database table fitting :class:`SheetSchema`.
        :type table: :class:`flask_sqlalchemy.Model`.
        :param pagination_parameters: Page, page size and total items
         of the pagination.
        :type pagination_parameters: dict
        :return: List of items from `table` with length `page_size`
        :rtype: :class:`werkzeug.wrappers.Response`
        """
        # Get a list of sheets according to the page and page_size parameters
        pagination = table.query \
            .order_by(table.upload_date.desc()) \
            .paginate(
                page=pagination_parameters.page,
                per_page=pagination_parameters.page_size)

        # Set the total number of users
        # for the X-Pagination header in the response
        pagination_parameters.item_count = pagination.total

        return pagination.items


@bp.route('/orders')
class ListOrderSheet(ListSheet):

    @bp.paginate()
    def get(self, pagination_parameters):
        """
        Get a list of uploaded order sheets in the system.

        The list is served in pages. These can be controlled using
        the parameters in the query string.
        Roles required: Planner, Administrator
        """
        return super().get(OrderSheet, pagination_parameters)


@bp.route('/trucks')
class ListTruckSheet(ListSheet):

    @bp.paginate()
    def get(self, pagination_parameters):
        """
        Get a list of uploaded truck sheets in the system.

        The list is served in pages. These can be controlled using
        the parameters in the query string.
        Roles required: Planner, Administrator
        """
        return super().get(TruckSheet, pagination_parameters)
