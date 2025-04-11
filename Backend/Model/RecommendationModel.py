from GraphBuilder import AirlineGraph

class RecommendationModel:
    def __init__(self, db_connection):
        # Variables
        self.db = db_connection
        self.graph = AirlineGraph().graph

    def get_trip_between_two_cities(self, cities):
        """
        Trip Between Two Cities.
        """
        try:
            # Setting up Source and Destination
            city1, city2 = cities
            
            # Querying Graph
            trip = self.graph.bfs(
                fromExpr=f"id = '{city1}'",
                toExpr=f"id = '{city2}'",
                maxPathLength=10
            )
            return trip.toPandas().to_dict(orient="records")

            # Checking Return Data
            if not trip:
                return {"message": "No Country"}

        except Exception as e:
            return {"error": str(e)}

    def get_trip_between_two_cities_in_stops(self, cities, stops):
        """
        Trip Between Two Cities Within Stops.
        """
        try:
            # Setting up Source and Destination
            city1, city2 = cities

            # Querying Graph
            trip = self.graph.bfs(
                fromExpr=f"id = '{city1}'",
                toExpr=f"id = '{city2}'",
                edgeFilter=f"stops <= {stops}",
                maxPathLength=int(stops) + 1
            )
            return trip.toPandas().to_dict(orient="records")
        
            # Checking Return Data
            if not trip:
                return {"message": "No Country"}

        except Exception as e:
            return {"error": str(e)}

    def get_cities_within_stops(self, city, stops):
        """
        Cities Within Stops of City.
        """
        try:
            # Querying Graph
            cities = self.graph.bfs(
                fromExpr=f"id = '{city}'",
                toExpr="true",  
                maxPathLength=stops
            )

            # Checking Return Data
            if not cities:
                return {"message": "No Country"}

            return cities.select("from.id", "to.id").distinct().toPandas().to_dict(orient="records")

        except Exception as e:
            return {"error": str(e)}