from flask.views import MethodView
from flask_smorest import abort
from flask_login import current_user
from .schemas import PlanningSchema
from backend.plugins import db
from backend.extensions import roles_required, Blueprint
from backend.models import Planning
from backend.models import TruckSheet, OrderSheet


bp = Blueprint('plannings',
               'plannings',
               description='Publish and view plannings')


@bp.route('/')
class Plannings(MethodView):

    @roles_required('view-only', 'planner', 'administrator')
    @bp.response(PlanningSchema(many=True))
    @bp.paginate()
    def get(self, pagination_parameters):
        """
        Get a list of plannings in the system.

        The list is served in pages. These can be controlled using
        the parameters in the query string.

        Roles required: View-only, planner, administrator
        """
        # Get a list of plannings according to the page
        # and page_size parameters
        pagination = Planning.query. \
            order_by(Planning.published_on.desc()). \
            paginate(
                page=pagination_parameters.page,
                per_page=pagination_parameters.page_size)

        # Set the total number of plannings
        # for the X-Pagination header in the response
        pagination_parameters.item_count = pagination.total

        return pagination.items


@bp.route('/<truck_sheet_id>/<order_sheet_id>')
class PlanningByID(MethodView):

    @roles_required('view-only', 'planner', 'administrator')
    @bp.response(PlanningSchema)
    @bp.alt_response('NOT_FOUND', code=404)
    def get(self, truck_sheet_id, order_sheet_id):
        """
        Get a single planning.

        `Truck_sheet_id` and `order_sheet_id` can both be the primary key of
        the sheets, or `latest` to use the latest sheet.

        Roles required: View-only, planner, administrator
        """
        truck_sheet = TruckSheet.query.get_sheet_or_404(truck_sheet_id)

        order_sheet = OrderSheet.query.get_sheet_or_404(order_sheet_id)

        # Return the planning if it exists, otherwise respond with a 404
        return Planning.query.get_or_404((truck_sheet.id, order_sheet.id))

    @roles_required('planner', 'administrator')
    @bp.response(PlanningSchema)
    @bp.alt_response('BAD_REQUEST', code=400)
    @bp.alt_response('NOT_FOUND', code=404)
    def post(self, truck_sheet_id, order_sheet_id):
        """
        Publish a planning.

        Both the truck availability sheet and the order sheet cannot be used
        already in another planning. If that is the case, a 400 response will
        be returned.

        `Truck_sheet_id` and `order_sheet_id` can both be the primary key of
        the sheets, or `latest` to use the latest sheet.
        """
        truck_sheet = TruckSheet.query.get_sheet_or_404(truck_sheet_id)

        order_sheet = OrderSheet.query.get_sheet_or_404(order_sheet_id)

        # Check if either one of the sheet already has a planning
        if truck_sheet.planning is None and order_sheet.planning is None:
            # Create a new planning
            planning = Planning(truck_sheet.id,
                                order_sheet.id,
                                current_user.id)
            db.session.add(planning)
            db.session.commit()
            return planning

        # One of the sheets is already used in a planning
        abort(400,
              message='Truck sheet or order sheet is already '
                      'used in a published planning')
