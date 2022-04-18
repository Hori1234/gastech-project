from flask.views import MethodView
from flask_login import current_user
from flask_smorest import abort
from backend.models import Order, Truck, TruckSheet
from backend.extensions import Blueprint, roles_required, unnest
from .schemas import TruckSchema, TruckTableSchema
from backend.plugins import db


bp = Blueprint('trucks',
               'trucks',
               description='Request and change truck availability')


@bp.route('/sheet/<sheet_id_or_latest>')
class Trucks(MethodView):

    @roles_required('view-only', 'planner', 'administrator')
    @bp.response(TruckTableSchema)
    @bp.alt_response('NOT_FOUND', code=404)
    def get(self, sheet_id_or_latest):
        """
        Get a list of truck from a truck sheet.

        In case `sheet_id_or_latest` is `latest`, the most recently uploaded
        truck sheet will be used.

        Required roles: planner, administrator
        """
        is_view_only = current_user.role == 'view-only'
        truck_sheet = TruckSheet.query.get_sheet_or_404(sheet_id_or_latest,
                                                        is_view_only)
        return truck_sheet

    @roles_required('planner', 'administrator')
    @bp.arguments(TruckSchema)
    @bp.response(TruckSchema)
    def post(self, truck, sheet_id_or_latest):
        """
        Create a new truck in a truck list.

        In case `sheet_id_or_latest` is `latest`, the most recently uploaded
        truck sheet will be used.

        The request can contain any key value pair.
        If the key is not known, a new field will be created for it.

        Required roles: planner, administrator
        """
        truck_sheet = TruckSheet.query.get_sheet_or_404(sheet_id_or_latest)

        # Published plannings cannot be changed
        if truck_sheet.planning is not None:
            return abort(400,
                         message='Truck sheet has already been used in a '
                                 'planning, cannot add a truck to it.')

        # store order numbers before creating the truck,
        # as we will be adding them later
        orders = truck.pop('orders', None)

        # Filter any None values in the request
        truck_not_null = {k: v for k, v in truck.items() if v is not None}

        # Marshmallow might parse the value as a dictionary
        # so we have to revert it back

        truck = truck_not_null.copy()

        for k, v in truck_not_null.items():
            if isinstance(v, dict):
                new_k, new_v = unnest(truck_not_null, k)
                truck[new_k] = new_v
                truck.pop(k)

        # Create a new truck with all parameters
        try:
            new_truck = Truck(**truck)

            # Assign the orders to the truck
            if orders is not None:
                order_numbers = [order['order_number'] for order in orders]
                departure_times = [order['departure_time'] for order in orders]
                order_objects = Order.query.get_all_or_404(order_numbers)
                new_truck.assign_orders(order_objects, departure_times)
        except ValueError as e:
            # Some values of the arguments are not allowed
            return abort(400,
                         message=str(e),
                         status="Bad Request")

        # Add the truck to the truck sheet
        truck_sheet.add_row(new_truck)
        db.session.commit()
        return new_truck


@bp.route('/<int:truck_id>')
class TruckByID(MethodView):

    @roles_required('planner', 'administrator')
    @bp.response(TruckSchema)
    @bp.alt_response('UNAUTHORIZED', code=401)
    @bp.alt_response('NOT_FOUND', code=404)
    @bp.alt_response('SERVICE_UNAVAILABLE', code=503)
    def get(self, truck_id):
        """
        Get a specific truck on a truck sheet.

        Required roles: planner, administrator
        """
        # Try to parse the sheet_id to an int and get the truck
        truck = Truck.query.get_or_404(
            truck_id,
            description='Truck not found')
        return truck

    @roles_required('planner', 'administrator')
    @bp.response(code=204)
    @bp.alt_response('UNAUTHORIZED', code=401)
    @bp.alt_response('NOT_FOUND', code=404)
    @bp.alt_response('SERVICE_UNAVAILABLE', code=503)
    def delete(self, truck_id):
        """
        Delete a specific truck from a truck sheet.

        When a truck is deleted, the other trucks will get a new id assigned.

        Required roles: planner, administrator
        """
        # Try to parse the sheet_id to an int and get the truck
        truck = Truck.query.get_or_404(truck_id, description='Truck not found')

        # Published plannings cannot be changed
        if truck.truck_sheet.planning is not None:
            return abort(400,
                         message='Truck sheet has already been used in a '
                                 'planning, cannot delete a truck from it.')

        db.session.delete(truck)
        db.session.commit()
        return "", 204

    @roles_required('planner', 'administrator')
    @bp.arguments(TruckSchema(partial=True))
    @bp.response(TruckSchema)
    @bp.alt_response('UNAUTHORIZED', code=401)
    @bp.alt_response('NOT_FOUND', code=404)
    @bp.alt_response('SERVICE_UNAVAILABLE', code=503)
    def patch(self, req, truck_id):
        """
        Change a specific truck from a truck sheet.

        In case `sheet_id_or_latest` is `latest`, the most recently uploaded
        truck sheet will be used.

        The request can contain any key value pair except the key 'others'.
        If the key is not known, a new field will be created for it.

        Required roles: planner, administrator
        """
        try:
            # Try to parse the sheet_id to an int and get the truck
            truck = Truck.query.get_or_404(truck_id,
                                           description='Truck not found')

            if truck.truck_sheet.planning is not None:
                return abort(400,
                             message='Truck sheet has already been used in a '
                                     'planning, cannot change a truck '
                                     'from it.')

            # Pop orders early to handle them manually
            orders = req.pop('orders', None)

            # Make sure the primary key is not changed
            if 's_number' in req:
                abort(
                    400,
                    message='Cannot set field "s_number"',
                    status="Bad Request"
                )

            # Iterate over the keys and values in the request
            for k, v in req.items():
                if k != "others" and hasattr(truck, k):
                    # If the key has a column (except 'others')
                    # in the database, change it
                    setattr(truck, k, v)
                else:
                    # If the key doesn't have column,
                    # place it in the other columns
                    # if the value is null,
                    # remove the key from the truck
                    if k in truck.others and v is None:
                        del truck.others[k]
                    elif isinstance(v, dict):
                        # Marshmallow parsed the value as a dictionary
                        # so we have to revert it back
                        new_k, new_v = unnest(req, k)
                        truck.others[new_k] = new_v
                    elif v is not None:
                        truck.others[k] = v

            # Change orders assigned to truck
            if orders is not None:
                order_numbers = [order['order_number'] for order in orders]
                departure_times = [order['departure_time'] for order in orders]
                order_objects = Order.query.get_all_or_404(order_numbers)
                truck.assign_orders(order_objects, departure_times)

            db.session.commit()
            return truck, 200
        except ValueError as e:
            # Some values of the arguments are not allowed
            abort(400,
                  message=str(e),
                  status="Bad Request"
                  )
