from Config.GraphFrames import AirlineGraph

class RecommendationModel:
    def __init__(self, db_connection):
        # Variables
        self.db = db_connection
        self.graph = AirlineGraph().graph

    def get_iata_codes_by_city(self, city):
        df = self.graph.vertices.filter(f"city = '{city}'")
        return df.select("id").rdd.flatMap(lambda row: row).collect()

    def get_trip_between_two_cities(self, city1, city2):
        """
        Trip Between Two Cities.
        """
        try:
            source_ids = self.get_iata_codes_by_city(city1)
            target_ids = self.get_iata_codes_by_city(city2)

            if not source_ids or not target_ids:
                return {"message": "One or both cities not found"}

            for src in source_ids:
                for dst in target_ids:
                    path = self.graph.bfs(
                        fromExpr=f"id = '{src}'",
                        toExpr=f"id = '{dst}'",
                        maxPathLength=10
                    )
                    if not path.rdd.isEmpty():
                        distinct_paths = path.dropDuplicates()
                        return distinct_paths.limit(100).toPandas().to_dict(orient="records")

            return {"message": "No Trip"}

        except Exception as e:
            return {"error": str(e)}


    def get_trip_between_two_cities_in_stops(self, city1, city2, stops):
        """
        Trip Between Two Cities Within Stops.
        Since the dataset contains only 0 stops, this method returns any path regardless of stop count.
        """
        try:
            source_ids = self.get_iata_codes_by_city(city1)
            target_ids = self.get_iata_codes_by_city(city2)

            if not source_ids or not target_ids:
                return {"message": "One or both cities not found"}

            for src in source_ids:
                for dst in target_ids:
                    path = self.graph.bfs(
                        fromExpr=f"id = '{src}'",
                        toExpr=f"id = '{dst}'",
                        maxPathLength=int(stops) + 1  # Keep it bounded by maxPathLength
                    )
                    if not path.rdd.isEmpty():
                        distinct_paths = path.dropDuplicates()
                        return distinct_paths.limit(100).toPandas().to_dict(orient="records")


            return {"message": "No Trip"}
        except Exception as e:
            return {"error": str(e)}


    def get_cities_within_stops(self, city, stops):
        """
        Cities Within Stops of City.
        """
        try:
            source_ids = self.get_iata_codes_by_city(city)

            if not source_ids:
                return {"message": "City not found"}

            all_paths = []

            for src in source_ids:
                path = self.graph.bfs(
                    fromExpr=f"id = '{src}'",
                    toExpr="true",
                    maxPathLength=int(stops)
                )

                if not path.rdd.isEmpty():
                    subset = path.select("from.id", "to.id").distinct().toPandas().to_dict(orient="records")
                    all_paths.extend(subset)

            if not all_paths:
                return {"message": "No Trip"}

            return all_paths

        except Exception as e:
            return {"error": str(e)}