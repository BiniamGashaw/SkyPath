import pymysql
import os
from dotenv import load_dotenv

load_dotenv()  

class Database:
    """
    Database configuration.
    """
    def __init__(self):
        self.connection = None

    def get_connection(self):
        # Check current connection
        if self.connection and self.connection.open:
            return self.connection

        # Establish connection with 3 tries
        retries = 3
        while retries > 0:
            try:
                self.connection = pymysql.connect(
                    host=os.getenv("DB_HOST"),
                    user=os.getenv("DB_USER"),
                    password=os.getenv("DB_PASSWORD") ,
                    database=os.getenv("DB_NAME"),
                    port=int(os.getenv("DB_PORT")),
                    cursorclass=pymysql.cursors.DictCursor
                )
                print("Database connection established.")
                return self.connection
            except Exception as e:
                print(f"Error connecting to the write database: {e}")
                retries -= 1
                if retries == 0:
                    raise e

    def close_connections(self):
        if self.connection and self.connection.open:
            self.connection.close()
            print("Database connection closed.")