

class AggregationModel:
    def __init__(self, db_connection):
        # Variables
        self.db = db_connection

    def get_country_with_most_airports(self): 
        """
        Country with Most Airports.
        """
        try:
            with self.db.cursor() as cursor:
                # Querying Data
                cursor.execute(
                    """
                        SELECT country, COUNT(*) as num_airports 
                        FROM airports 
                        GROUP BY country 
                        ORDER BY num_airports DESC 
                        LIMIT 1;
                    """
                )
                country = cursor.fetchone()

                # Checking Return Data
                if not country:
                    return {"message": "No Country"}

                return country

        except Exception as e:
            return {"error": "An error occurred while fetching country", "details": str(e)}

    def get_cities_with_most_airlines(self, k): 
        """
        City with Most Airlines.
        """
        k = int(k) if k and str(k).isdigit() and int(k) > 0 else 5
        try:
            with self.db.cursor() as cursor:
                # Querying Data
                cursor.execute(
                    """
                        SELECT a.city, COUNT(*) as total_routes
                        FROM (
                            SELECT `Source airport` AS airport FROM routes
                            UNION ALL
                            SELECT `Destination airport` AS airport FROM routes
                        ) AS all_routes
                        JOIN airports a ON all_routes.airport = a.iata
                        GROUP BY a.city
                        ORDER BY total_routes DESC
                        LIMIT %s;

                    """,
                    (k,)
                )
                cities = cursor.fetchall()

                # Checking Return Data
                if not cities:
                    return {"message": "Country has no cities"}
                
                return cities

        except Exception as e:
            return {"error": "An error occurred while fetching cities", "details": str(e)}