

class SearchModel:
    def __init__(self, db_connection):
        # Variables
        self.db = db_connection

    def get_airports_by_country(self, country): 
        """
        Airports by country.
        """
        try:
            with self.db.cursor() as cursor:
                # Querying Data
                cursor.execute(
                    """
                    SELECT name, city FROM airports WHERE country = %s
                    """,
                    (country,)
                )
                airports = cursor.fetchall()

                # Checking Return Data
                if not airports:
                    return {"message": "Country has no airports"}
                
                return airports

        except Exception as e:
        return {"error": "An error occurred while fetching airports", "details": str(e)}

    def get_airlines_by_stop(self, stops): 
        """
        Airlines by stops.
        """
        try:
            with self.db.cursor() as cursor:
                # Querying Data
                cursor.execute(
                    """
                    SELECT DISTINCT airline FROM routes WHERE stops = %s
                    """,
                    (stops,)
                )
                airlines = cursor.fetchall()

                # Checking Return Data
                if not airlines:
                    return {"message": f"No airlines with {stops} stops"}
                
                return airlines

        except Exception as e:
        return {"error": "An error occurred while fetching airlines", "details": str(e)}

    def get_airlines_with_code_share(self): 
        """
        Airlines with code share.
        """
        try:
            with self.db.cursor() as cursor:
                # Querying Data
                cursor.execute(
                    """
                    SELECT DISTINCT airline FROM routes WHERE codeshare = 'Y';
                    """
                )
                airlines = cursor.fetchall()

                # Checking Return Data
                if not airlines:
                    return {"message": "No airlines with code share"}
                
                return airlines

        except Exception as e:
        return {"error": "An error occurred while fetching airlines", "details": str(e)}

    def get_active_airlines_in_united_state(self): 
        """
        Active Airlines in United States.
        """
        try:
            with self.db.cursor() as cursor:
                # Querying Data
                cursor.execute(
                    """
                    SELECT * FROM airlines WHERE active = 'Y' AND country = 'United States';
                    """
                )
                airlines = cursor.fetchall()

                # Checking Return Data
                if not airlines:
                    return {"message": "No airlines in the United States"}
                
                return airlines

        except Exception as e:
        return {"error": "An error occurred while fetching airlines", "details": str(e)}