from flask import Blueprint, jsonify, request
from Config.Db import Database
from Model.SearchModel import SearchModel

class SearchController:
    """
    Controller for Search.
    """
    def __init__(self):
        # Variales
        self.blueprint = Blueprint('search_blueprint', __name__)
        self.db = Database()

        # Routes
        self.blueprint.add_url_rule('/Find_Airport_By_Country', view_func=self.find_airports_by_country, methods=['GET'])
        self.blueprint.add_url_rule('/Find_Airlines_By_Stop', view_func=self.find_airlines_by_stop, methods=['GET'])
        self.blueprint.add_url_rule('/Find_Airlines_With_Code_Share', view_func=self.find_airlines_with_code_share, methods=['GET'])
        self.blueprint.add_url_rule('/Find_Active_Airlines_In_United_State', view_func=self.find_active_airlines_in_united_state, methods=['GET'])

    def find_airports_by_country(self):
        try:
            # Request Data
            data = request.json
            country = data.get("country")

            # Request Data Check
            if not country:
                return jsonify({"error": "Missing country"}), 400

            # Pulling Data from Database
            connection = self.db.connection()
            searchModel = SearchModel(connection)
            airports = searchModel.get_airports_by_country(country)

            # Return Data Check
            if not airports:
                return jsonify({"message": "No airports found"}), 404
            
            return jsonify(airports), 200

         except Exception as e:
            return jsonify({"error": "An error occurred while fetching airports", "details": str(e)}), 500

        finally:
            self.db.close_connections()


    def find_airlines_by_stop(self):
        try:
            # Request Data
            data = request.json
            stops = data.get("stops")

            # Request Data Check
            if not stops:
                return jsonify({"error": "Missing stops"}), 400

            # Pulling Data from Database
            connection = self.db.connection()
            searchModel = SearchModel(connection)
            airlines = searchModel.get_airlines_by_stop(stops)

            # Return Data Check
            if not airlines:
                return jsonify({"message": "No airlines found"}), 404
            
            return jsonify(airlines), 200

         except Exception as e:
            return jsonify({"error": "An error occurred while fetching airlines", "details": str(e)}), 500

        finally:
            self.db.close_connections()

    def find_airlines_with_code_share(self):
        try:
            # Pulling Data from Database
            connection = self.db.connection()
            searchModel = SearchModel(connection)
            airlines = searchModel.get_airlines_with_code_share()

            # Return Data Check
            if not airlines:
                return jsonify({"message": "No airlines found"}), 404
            
            return jsonify(airlines), 200

         except Exception as e:
            return jsonify({"error": "An error occurred while fetching airlines", "details": str(e)}), 500

        finally:
            self.db.close_connections()

    def find_active_airlines_in_united_state(self)
        try:
            # Pulling Data from Database
            connection = self.db.connection()
            searchModel = SearchModel(connection)
            airlines = searchModel.get_airlines_with_code_share()

            # Return Data Check
            if not airlines:
                return jsonify({"message": "No airlines found"}), 404
            
            return jsonify(airlines), 200

            except Exception as e:
                return jsonify({"error": "An error occurred while fetching airlines", "details": str(e)}), 500

            finally:
                self.db.close_connections()

# Creating Instance
search_controller = SearchController()
search_blueprint = search_controller.blueprint