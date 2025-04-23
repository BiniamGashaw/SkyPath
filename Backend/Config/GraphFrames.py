from Config.Spark import SparkConnector
from graphframes import GraphFrame  # This is safe now since SparkSession is configured

class AirlineGraph:
    def __init__(self):
        connector = SparkConnector()

        self.vertices = connector.airports.selectExpr(
            "iata AS id", "name", "city", "country"
        )

        self.edges = connector.routes.selectExpr(
            "`Source airport` AS src",
            "`Destination airport` AS dst",
            "Airline AS airline",
            "Stops AS stops"
        )

        self.graph = GraphFrame(self.vertices, self.edges)
        
    def find_airlines_by_minimum_hops(self, min_stops):
        from pyspark.sql.functions import col

        # Find all paths up to a maximum depth (e.g., 4)
        paths = self.graph.bfs(
            fromExpr="id IS NOT NULL",
            toExpr="id IS NOT NULL",
            maxPathLength=int(min_stops + 1)
        )

        if paths.isEmpty():
            return []

        # Filter paths by actual hop count (min_stops)
        filtered = paths.filter(f"size(edges) >= {min_stops}")
        if filtered.isEmpty():
            return []

        # Extract airlines from each edge
        edge_columns = [col(col_name + ".airline") for col_name in filtered.columns if col_name.startswith("e")]
        airlines = filtered.select(*edge_columns).distinct()

        # Flatten results
        melted = airlines.selectExpr("stack(" + str(len(edge_columns)) + ", " +
                                    ", ".join([f"{c._jc.toString()}, '{c._jc.toString()}'" for c in edge_columns]) +
                                    ") as (airline, colname)")
        return melted.filter("airline IS NOT NULL").distinct()
