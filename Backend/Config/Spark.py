from pyspark.sql import SparkSession
from dotenv import load_dotenv
import os

load_dotenv()

class SparkConnector:
    def __init__(self):
        import os

# Correct path based on where the script is running
        jar_path = "/Users/biniam/CS431/SkyPath/Backend/lib/mysql-connector-j-9.3.0.jar"
# or better: dynamically resolve it from the script’s directory
# jar_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../lib/mysql-connector-j-9.3.0.jar"))

        print("✅ FINAL JDBC JAR PATH:", jar_path)


        self.spark = SparkSession.builder \
            .appName("SkyPathApp") \
            .config("spark.jars", jar_path) \
            .config("spark.jars.packages", "graphframes:graphframes:0.8.2-spark3.1-s_2.12") \
            .getOrCreate()

        self.airports = self.spark.read \
            .format("jdbc") \
            .option("url", "jdbc:mysql://airlines-search-engine-db.chg68wcwe6cs.us-west-1.rds.amazonaws.com:3306/airDB") \
            .option("driver", "com.mysql.cj.jdbc.Driver") \
            .option("dbtable", "airports") \
            .option("user", os.getenv("JDBC_USER")) \
            .option("password", os.getenv("JDBC_PASSWORD")) \
            .load()

        self.routes = self.spark.read \
            .format("jdbc") \
            .option("url", "jdbc:mysql://airlines-search-engine-db.chg68wcwe6cs.us-west-1.rds.amazonaws.com:3306/airDB") \
            .option("driver", "com.mysql.cj.jdbc.Driver") \
            .option("dbtable", "routes") \
            .option("user", os.getenv("JDBC_USER")) \
            .option("password", os.getenv("JDBC_PASSWORD")) \
            .load()
