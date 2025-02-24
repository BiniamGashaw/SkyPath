


			
SkyPath CS 431 Project Proposal
University of Nevada, Reno
Department of Computer Science and Engineering
CS 431 Intro to Big Data
Dr. Lei Yang
February 23, 2025
 By: Biniam Gashaw, Angelo Calingo, Sutter Reynolds








Problem
Airline Search Engine. You can use the data stored here: https://openflights.org/data.php. This dataset contains the flight details of various airlines like: Airport id, Name of the airport, Main city served by airport, Country or territory where airport is located, Code of Airport, Decimal degrees, Hours offset from UTC, Timezone, etc.. Implement an airline data search engine using Hadoop, Spark, or other tools. The tool is able to help users to find out facts/trips with requested information/constraints:
Data Set: https://openflights.org/data.php
Airport and Airline Search
1.      Find list of Airports operating in the Country X
2.      Find the list of Airlines having X stops
3.      List of Airlines operating with code share
4.      Find the list of Active Airlines in the United States
Airline Aggregation
5.      Which country (or) territory has the highest number of Airports
6.      The top k cities with most incoming/outgoing airlines
Trip Recommendation
7.      Define a trip as a sequence of connected routes. Find a trip that connects two cities X and Y (reachability).
8.      Find a trip that connects X and Y with less than Z stops (constrained reachability).
9.      Find all the cities reachable within d hops of a city (bounded reachability).
10.    Fast Transitive closure/connected component implemented in parallel/distributed algorithms.
Tasks to Finish

Phase 1: Research & Setup
Review OpenFlights dataset structure and determine necessary fields
Identify relevant attributes (Airport ID, City, Country, Code, etc.) for queries
Download OpenFlights dataset from the provided source
Store the raw dataset in AWS S3 for scalability and accessibility
Define a schema for MySQL database storage
Install and configure necessary tools: FastAPI, Flask, PyTorch, Docker, React.js
Configure AWS Glue for data transformation and ETL processing
Set up MySQL database and define structured tables
Establish backend boilerplate code and connect MySQL with API services
Define API endpoints and their input/output specifications
Design a scalable architecture for backend, data processing, and frontend
Create wireframes/mockups for the UI using React.js

Phase 2: Backend Development & Data Pipeline
Use AWS Glue to clean raw data: handle missing values, normalize formats, and remove duplicates
Transform raw data into a structured format suitable for MySQL storage
Create necessary tables and indexes in MySQL for structured storage
Automate data ingestion from AWS S3 to MySQL
Develop Flask-based query processing layer for handling user queries
Implement FastAPI to serve as the primary backend framework for API interactions
Deploy Apache as a web server to handle HTTP requests
Ensure API security with authentication and input validation
Develop AWS Glue scripts for automating Extract, Transform, Load (ETL) processes
Integrate AWS Kinesis for real-time data streaming and updates
Implement PyTorch-based machine learning models for trip recommendations
Store processed data in MySQL to optimize query performance
Conduct unit testing on API endpoints to validate response accuracy
Verify data consistency and correctness in MySQL database
Phase 3: Frontend Development & API Integration
Develop main UI components using React.js and Tailwind CSS
Create search interfaces for airport, airline, and trip queries
Ensure UI responsiveness for different screen sizes
Implement API calls to interact with FastAPI and Flask endpoints
Validate API responses and handle loading states/errors in the frontend
Display real-time search results dynamically in the UI
Perform user testing to refine UI/UX for better usability

Phase 4: Final Testing, Deployment & Optimization
Optimize query execution and indexing for faster searches
Containerize backend services using Docker for easier deployment
Deploy system to AWS infrastructure using EC2, Lambda, and RDS
Debug to eliminate errors and inconsistencies
Prepare project documentation
Finalize and submit the completed project


















Tech/Tools/Systems
Big Data & AI Framework
PyTorch - For machine learning and deep learning
Flask - For queries
Storage & Data Pipeline
AWS S3 - Primary storage for data
AWS Glue  - data integration
AWS Kinesis - data streaming
MySQL  - Storing data
Backend API
FastAPI (Python) - API framework
Apache  - Web server hosting
Frontend
React.js -  UI
Tailwind CSS  - Styling
Deployment & Orchestration
Docker  - Maintaining Services
AWS  - Deployment
Implementation/Evaluation Plan (justification)

Implementation
1.  Data Acquisition & Storage
Download datasets 
Store raw data in AWS S3.
Use AWS Glue to clean and transform data.
Store structured data in MySQL for accessibility.


2. Backend Development
Use FastAPI for creating API endpoints.
Use Flask for queries.
Deploy API using Apache.


3. Data Processing & Analytics
Use AWS Kinesis to process real-time data.
Implement PyTorch for ML algorithms.
Use AWS Glue to process and transform data.


4. Frontend Development
Design a UI using React.js.
Style UI with Tailwind CSS.


5. Deployment & Orchestration
Containerize services with Docker.
Deploy using AWS


Evaluation Plan
The Airline Search Engine is designed to fully leverage AWS services scalability, efficiency, and data processing. AWS S3 will provide scalable and storage, while AWS Glue automates ETL workflows for data transformation. AWS Kinesis provides real-time data streaming, ensuring quick and easy  updates.


PyTorch will be our core machine learning framework, which will be used for travel recommendations based on processed data. AWS Glue structures raw data for querying. MySQL will be used for data storage. Apache functions as the web server, managing requests, while being combined with FastAPI and Flask for API implementation.


The frontend will be built using React.js for UI matched with  Tailwind CSS for responsive design and styling. Docker is used for containerization, enabling smooth deployment across AWS services, including EC2, Lambda, and RDS. This will ensure availability and efficiency in order to handle complex real time search queries .
.





Timeline and Milestones
Phase 1: Research & Setup (Feb 23 - Mar 3)
Goal: Finalize project scope, set up the development environment, and define team roles.
Feb 23 - Feb 26:
Review OpenFlights dataset, understand structure, and decide data schema.
Set up an AWS S3 bucket for raw data storage.
Configure MySQL database schema for structured data.
Feb 27 - Mar 1:
Set up AWS Glue for data transformation.
Install & configure necessary tools: FastAPI, Flask, PyTorch, Docker, React.js.
Initial backend boilerplate setup.
Mar 2 - Mar 3:
Finalize API endpoint design (input/output specifications).
Create initial UI wireframes for React.js frontend.

Phase 2: Backend Development & Data Pipeline (Mar 4 - Mar 17)
Goal: Implement core backend APIs and data ingestion pipeline.
Mar 4 - Mar 8:
Develop AWS Glue scripts for cleaning and structuring data.
Implement MySQL database interactions (CRUD operations).
Mar 9 - Mar 12:
Build Flask query processing layer.
Implement FastAPI for core API functionalities.
Deploy Apache as a web server.
Mar 13 - Mar 17:
Integrate AWS Kinesis for real-time data processing.
Implement PyTorch models for trip recommendations.
Conduct unit testing on API responses.

Phase 3: Frontend Development & API Integration (Mar 18 - Mar 31)
Goal: Develop UI and connect with backend APIs.
Mar 18 - Mar 22:
Build the main UI components using React.js & Tailwind CSS.
Develop frontend interactions for search queries.
Mar 23 - Mar 27:
Implement API calls in the frontend.
Validate data responses from backend.
Mar 28 - Mar 31:
Perform user testing & UI improvements.
Ensure smooth data flow between frontend and backend.

Phase 4: Final Testing, Deployment & Optimization (Apr 1 - Apr 15)
Goal: Final testing, optimizations, and deployment.
Apr 1 - Apr 5:
Optimize queries for better performance.
Implement additional UI enhancements.
Apr 6 - Apr 10:
Containerize services using Docker.
Deploy project to AWS.
Apr 11 - Apr 13:
Final debugging and error fixes.
Apr 14 - Apr 15:
Perform final testing, prepare documentation, and submit projects.
