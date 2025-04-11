from flask import Blueprint, jsonify, request
from Config.Db import Database
from Model.AggregationModel import AggregationModel

class AggregationController:
    """
    Controller for Aggregation.
    """
    def __init__(self):
        # Variales
        self.blueprint = Blueprint('aggregation_blueprint', __name__)
        self.db = Database()

        # Routes
        self.blueprint.add_url_rule('/Find_Country_With_Most_Airports', view_func=self.find_country_with_most_airports, methods=['GET'])
        self.blueprint.add_url_rule('/Find_Cities_With_Most_Airlines', view_func=self.find_cities_with_most_airlines, methods=['GET'])

    def find_country_with_most_airports(self):
        try:
            # Pulling Data from Database
            connection = self.db.connection()
            aggregationModel = AggregationModel(connection)
            country = aggregationModel.get_country_with_most_airports

            # Return Data Check
            if not country:
                return jsonify({"message": "No country found"}), 404
            
            return jsonify(country), 200

         except Exception as e:
            return jsonify({"error": "An error occurred while fetching country", "details": str(e)}), 500

        finally:
            self.db.close_connections()
            

    def find_cities_with_most_airlines(self):
        try:
            # Request Data
            data = request.json
            k = data.get("k")

            # Request Data Check
            if not k:
                return jsonify({"error": "Missing k"}), 400

            # Pulling Data from Database
            connection = self.db.connection()
            aggregationModel = aggregationModel(connection)
            cities = aggregationModel.get_cities_with_most_airlines(k)

            # Return Data Check
            if not airlines:
                return jsonify({"message": "No cities found"}), 404
            
            return jsonify(cities), 200
        
        finally:
            self.db.close_connections()

# Creating Instance
aggregation_controller = AggregationController()
aggregation_blueprint = aggregation_controller.blueprint