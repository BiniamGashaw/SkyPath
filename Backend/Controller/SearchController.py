from flask import Blueprint, jsonify, request
from Config.Db import Database
from Model.SearchModel import SearchModel
from Config.Spark import SparkConnector
from Config.GraphFrames import AirlineGraph
from graphframes import GraphFrame
from pyspark.sql.functions import col, size, explode, array
import os

class SearchController:
    """
    Controller for Search.
    """
    def __init__(self):
        self.blueprint = Blueprint('search_blueprint', __name__)
        self.db = Database()

        self.blueprint.add_url_rule('/Find_Airport_By_Country', view_func=self.find_airports_by_country, methods=['GET'])
        self.blueprint.add_url_rule('/Find_Airlines_By_Stop', view_func=self.find_airlines_by_stop, methods=['GET'])
        self.blueprint.add_url_rule('/Find_Airlines_With_Code_Share', view_func=self.find_airlines_with_code_share, methods=['GET'])
        self.blueprint.add_url_rule('/Find_Active_Airlines_In_United_State', view_func=self.find_active_airlines_in_united_state, methods=['GET'])

    def find_airports_by_country(self):
        try:
            country = request.args.get("country")
            if not country:
                return jsonify({"error": "Missing country"}), 400

            connection = self.db.get_connection()
            searchModel = SearchModel(connection)
            airports = searchModel.get_airports_by_country(country)

            if not airports:
                return jsonify({"message": "No airports found"}), 404

            return jsonify(airports), 200

        except Exception as e:
            return jsonify({"error": "An error occurred while fetching airports", "details": str(e)}), 500

        finally:
            self.db.close_connections()

    def find_airlines_by_stop(self):
        try:
            stops = int(request.args.get("stops", 0))
            connector = SparkConnector()
            airline_graph = AirlineGraph()

            airline_graph.vertices = connector.airports.selectExpr("iata AS id", "name", "city", "country")
            airline_graph.edges = connector.routes.selectExpr(
                "`Source airport` AS src",
                "`Destination airport` AS dst",
                "Airline AS airline",
                "Stops AS stops"
            )
            airline_graph.graph = GraphFrame(airline_graph.vertices, airline_graph.edges)

            if stops == 0:
                direct_routes = airline_graph.edges.filter("stops = 0")
                direct_airlines = direct_routes.select("airline").distinct().rdd.flatMap(lambda row: row).collect()
                airline_lookup = connector.spark.read \
                    .format("jdbc") \
                    .option("url", "jdbc:mysql://airlines-search-engine-db.chg68wcwe6cs.us-west-1.rds.amazonaws.com:3306/airDB") \
                    .option("driver", "com.mysql.cj.jdbc.Driver") \
                    .option("dbtable", "airlines") \
                    .option("user", os.getenv("JDBC_USER")) \
                    .option("password", os.getenv("JDBC_PASSWORD")) \
                    .load() \
                    .select("iata", "name") \
                    .rdd.collectAsMap()
                formatted = [{"airline": a, "name": airline_lookup.get(a, "Unknown")} for a in direct_airlines if a]
                return jsonify(formatted), 200

            paths = airline_graph.graph.bfs(
                fromExpr="id IS NOT NULL",
                toExpr="id IS NOT NULL",
                edgeFilter=f"stops >= {stops}",
                maxPathLength=stops + 1
            )

            if paths.rdd.isEmpty():
                return jsonify({"message": "No paths found"}), 404

            edge_columns = [c for c in paths.columns if c.startswith("e")]
            if not edge_columns:
                return jsonify({"message": "No edge paths with hops", "airlines": []}), 200

            airline_exprs = [col(f"{c}.airline").alias(f"{c}_airline") for c in edge_columns]
            airline_df = paths.select(*airline_exprs).distinct()
            all_airlines = airline_df.rdd.flatMap(lambda row: [a for a in row if a is not None]).distinct().collect()
            airline_lookup = connector.spark.read \
                .format("jdbc") \
                .option("url", "jdbc:mysql://airlines-search-engine-db.chg68wcwe6cs.us-west-1.rds.amazonaws.com:3306/airDB") \
                .option("driver", "com.mysql.cj.jdbc.Driver") \
                .option("dbtable", "airlines") \
                .option("user", os.getenv("JDBC_USER")) \
                .option("password", os.getenv("JDBC_PASSWORD")) \
                .load() \
                .select("iata", "name") \
                .rdd.collectAsMap()
            formatted = [{"airline": a, "name": airline_lookup.get(a, "Unknown")} for a in all_airlines]
            return jsonify(formatted), 200

        except Exception as e:
            return jsonify({"error": "Failed to fetch airlines", "details": str(e)}), 500

    def find_airlines_with_code_share(self):
        try:
            connection = self.db.get_connection()
            searchModel = SearchModel(connection)
            airlines = searchModel.get_airlines_with_code_share()

            if not airlines:
                return jsonify({"message": "No airlines found"}), 404

            return jsonify(airlines), 200

        except Exception as e:
            return jsonify({"error": "An error occurred while fetching airlines", "details": str(e)}), 500

        finally:
            self.db.close_connections()

    def find_active_airlines_in_united_state(self):
        try:
            connection = self.db.get_connection()
            searchModel = SearchModel(connection)
            airlines = searchModel.get_active_airlines_in_united_state()

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
