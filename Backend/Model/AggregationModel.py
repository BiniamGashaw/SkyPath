class AggregationModel:
    def __init__(self, db_connection):
        self.db = db_connection

    def get_country_with_most_airports(self): 
        """
        Country with Most Airports.
        """
        try:
            with self.db.cursor() as cursor:
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

                if not country:
                    return {"message": "No Country"}
                
                return country

        except Exception as e:
            return {"error": "An error occurred while fetching country", "details": str(e)}

    def get_cities_with_most_airlines(self, k): 
        """
        Cities with Most Airlines.
        """
        try:
            with self.db.cursor() as cursor:
                cursor.execute(
                    """
                        SELECT city, COUNT(*) as total_routes
                        FROM (
                            SELECT source_city AS city FROM routes
                            UNION ALL
                            SELECT destination_city AS city FROM routes
                        ) AS all_routes
                        GROUP BY city
                        ORDER BY total_routes DESC
                        LIMIT %s;
                    """,
                    (k,)
                )
                cities = cursor.fetchall()

                if not cities:
                    return {"message": "Country has no cities"}
                
                return cities

        except Exception as e:
            return {"error": "An error occurred while fetching cities", "details": str(e)}
