
#from graphframes import GraphFrame
from Config.Spark import SparkConnector

class AirlineGraph:
    def __init__(self):
        connector = SparkConnector()
        self.vertices = connector.airports.selectExpr("iata AS id", "name", "city", "country")
        self.edges = connector.routes.selectExpr(
            "`Source airport` AS src", 
            "`Destination airport` AS dst", 
            "Airline AS airline", 
            "Stops AS stops"
        )

        self.graph = GraphFrame(self.vertices, self.edges)

