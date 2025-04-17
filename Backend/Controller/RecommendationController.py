from flask import Blueprint, jsonify, request
from Config.Db import Database
from Model.RecommendationModel import RecommendationModel

class RecommendationController:
    """
    Controller for Aggregation.
    """
    def __init__(self):
        # Variales
        self.blueprint = Blueprint('recommendation_blueprint', __name__)
        self.db = Database()

        # Routes
        self.blueprint.add_url_rule('/Find_Trip_Between_Two_Cities', view_func=self.find_trip_between_two_cities, methods=['GET'])
        self.blueprint.add_url_rule('/Find_Trip_Between_Two_Cities_In_Stops', view_func=self.find_trip_between_two_cities_in_stops, methods=['GET'])
        self.blueprint.add_url_rule('/Find_Cities_Within_Stops', view_func=self.find_cities_within_stops, methods=['GET'])

    def find_trip_between_two_cities(self):
        try:
            # Request Data
            city1 = request.args.get("city1")
            city2 = request.args.get("city2")

            # Request Data Check
            if not city1 or not city2:
                return jsonify({"error": "Missing city1 or city2"}), 400

            # Pulling Data from Database
            connection = self.db.get_connection()
            recommendationModel = RecommendationModel(connection)
            trip = recommendationModel.get_trip_between_two_cities(city1, city2)

            # Return Data Check
            if not trip:
                return jsonify({"message": "No trip found"}), 404
            
            return jsonify(trip), 200

        except Exception as e:
            return jsonify({"error": "An error occurred while fetching trips", "details": str(e)}), 500

        finally:
                self.db.close_connections()

    def find_trip_between_two_cities_in_stops(self):
        try:
            # Request Data
            city1 = request.args.get("city1")
            city2 = request.args.get("city2")
            stops =request.args.get("stops")

            # Request Data Check
            if not city1 or not city2:
                return jsonify({"error": "Missing city1 or city2"}), 400
            if not stops:
                return jsonify({"error": "Missing stops"}), 400

            # Pulling Data from Database
            connection = self.db.get_connection()
            recommendationModel = RecommendationModel(connection)
            trip = recommendationModel.get_trip_between_two_cities_in_stops(city1, city2, stops)

            # Return Data Check
            if not trip:
                return jsonify({"message": "No trip found"}), 404
            
            return jsonify(trip), 200

        except Exception as e:
            return jsonify({"error": "An error occurred while fetching trips", "details": str(e)}), 500

        finally:
            self.db.close_connections()

    def find_cities_within_stops(self):
        try:
            # Request Data
            city = request.args.get("city")
            stops = request.args.get("stops")

            # Request Data Check
            if not city:
                return jsonify({"error": "Missing city"}), 400
            if not stops:
                return jsonify({"error": "Missing stops"}), 400


            # Pulling Data from Database
            connection = self.db.get_connection()
            recommendationModel = RecommendationModel(connection)
            trip = recommendationModel.get_cities_within_stops(city, stops)

            # Return Data Check
            if not trip:
                return jsonify({"message": "No trip found"}), 404
            
            return jsonify(trip), 200

        except Exception as e:
            return jsonify({"error": "An error occurred while fetching cities", "details": str(e)}), 500
        
        finally:
            self.db.close_connections()

# Creating Instance
recommendation_controller = RecommendationController()
recommendation_blueprint = recommendation_controller.blueprint
