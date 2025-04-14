from flask import Blueprint, jsonify, request
from Config.Db import Database
from Model.RecommendationModel import RecommendationModel

class RecommendationController:
    """
    Controller for Recommendation.
    """
    def __init__(self):
        self.blueprint = Blueprint('recommendation_blueprint', __name__)
        self.db = Database()

        # Routes
        self.blueprint.add_url_rule('/Find_Trip_Between_Two_Cities', view_func=self.find_trip_between_two_cities, methods=['GET'])
        self.blueprint.add_url_rule('/Find_Trip_Between_Two_Cities_In_Stops', view_func=self.find_trip_between_two_cities_in_stops, methods=['GET'])
        self.blueprint.add_url_rule('/Find_Cities_Within_Stops', view_func=self.find_cities_within_stops, methods=['GET'])

    def find_trip_between_two_cities(self):
        try:
            data = request.json
            cities = data.get("cities")

            if not cities:
                return jsonify({"error": "Missing cities"}), 400

            connection = self.db.connection()
            recommendationModel = RecommendationModel(connection)
            trip = recommendationModel.get_trip_between_two_cities(cities)

            if not trip:
                return jsonify({"message": "No trip found"}), 404

            return jsonify(trip), 200

        except Exception as e:
            return jsonify({"error": "An error occurred", "details": str(e)}), 500

        finally:
            self.db.close_connections()

    def find_trip_between_two_cities_in_stops(self):
        try:
            data = request.json
            cities = data.get("cities")
            stops = data.get("stops")

            if not cities:
                return jsonify({"error": "Missing cities"}), 400
            if not stops:
                return jsonify({"error": "Missing stops"}), 400

            connection = self.db.connection()
            recommendationModel = RecommendationModel(connection)
            trip = recommendationModel.get_trip_between_two_cities_in_stops(cities, stops)

            if not trip:
                return jsonify({"message": "No trip found"}), 404

            return jsonify(trip), 200

        except Exception as e:
            return jsonify({"error": "An error occurred", "details": str(e)}), 500

        finally:
            self.db.close_connections()

    def find_cities_within_stops(self):
        try:
            data = request.json
            city = data.get("city")
            stops = data.get("stops")

            if not city:
                return jsonify({"error": "Missing city"}), 400
            if not stops:
                return jsonify({"error": "Missing stops"}), 400

            connection = self.db.connection()
            recommendationModel = RecommendationModel(connection)
            trip = recommendationModel.get_cities_within_stops(city, stops)

            if not trip:
                return jsonify({"message": "No trip found"}), 404

            return jsonify(trip), 200

        except Exception as e:
            return jsonify({"error": "An error occurred", "details": str(e)}), 500

        finally:
            self.db.close_connections()

# Creating Instance
recommendation_controller = RecommendationController()
recommendation_blueprint = recommendation_controller.blueprint
