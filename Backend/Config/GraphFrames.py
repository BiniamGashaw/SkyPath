from graphframes import GraphFrame
from Config.Spark import SparkConnector

class AirlineGraph:
    def __init__(self):
        connector = SparkConnector()
        self.vertices = connector.airports.selectExpr("iata AS id", "name", "city", "country")
        self.edges = connector.routes.selectExpr(
            "source_airport AS src", 
            "destination_airport AS dst", 
            "airline", 
            "stops"
        )
        self.graph = GraphFrame(self.vertices, self.edges)

