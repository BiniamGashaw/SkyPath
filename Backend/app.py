import os
from flask import Flask
from Controller.SearchController import search_blueprint
from Controller.AggregationController import aggregation_blueprint
from Controller.RecommendationController import recommendation_blueprint


# Setting up Flask
app = Flask(__name__)

# Setting Up Blueprints 
app.register_blueprint(search_blueprint, url_prefix='/search')
app.register_blueprint(aggregation_blueprint, url_prefix='/aggregation')
app.register_blueprint(recommendation_blueprint, url_prefix='/recommendation')

#Run Flask app
if __name__ == "__main__":
    app.run(debug=True)
