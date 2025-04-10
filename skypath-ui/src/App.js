import React, { useState } from "react";
import "./App.css";
import planeLogo from "./logo3.webp";

function App() {
  const [country, setCountry] = useState("");
  const [city1, setCity1] = useState("");
  const [city2, setCity2] = useState("");
  const [stops, setStops] = useState("");
  const [tripStops, setTripStops] = useState("");
  const [codeShare, setCodeShare] = useState(false);
  const [activeUS, setActiveUS] = useState(false);
  const [airportDensity, setAirportDensity] = useState(false);
  const [airportTraffic, setAirportTraffic] = useState(false);
  const [result, setResult] = useState(false);
  const [distance, setDistance] = useState("");

  const InputSection = ({ children, output }) => (
    <div className="section row">
      <div className="input-group">{children}</div>
      <div className="output-box">{output}</div>
    </div>
  );
  

  return (
    <div className="app">
      <header className="header">
        <img src={planeLogo} alt="Plane icon" className="logo" />
        <h1>SKYPATH</h1>
      </header>

      <div className="category">
        <h2>Airline and Airport Search</h2>
        <p>
          Search for airlines and airports by country, number of stops, code
          share, and active US airlines
        </p>
      </div>

      <InputSection
        output={country && <p>Airlines for {country} will show here</p>}
      >
        <h2>Directions:</h2>
        <p>
          <strong>Input country</strong>
        </p>
        <p>
          Details: A list of all airlines operating in the input country is
          listed
        </p>
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Input country"
        />
        <button>Search</button>
      </InputSection>

      <InputSection output={<p>Airlines with stops will show here</p>}>
        <h2>Directions:</h2>
        <p>
          <strong>Enter the amount of stops wanted</strong>
        </p>
        <p>Details: A list of all airlines with inputted stops appear</p>
        <input
          type="number"
          value={stops}
          onChange={(e) => setStops(e.target.value)}
          placeholder="Amount of stops"
        />
        <button>Search</button>
      </InputSection>

      <InputSection output={<p>Code share results will show here</p>}>
        <h2>Directions:</h2>
        <p>
          <strong>Check mark if code share is wanted</strong>
        </p>
        <p>Details: A list of airlines operating with code share appears</p>
        <input
          type="checkbox"
          checked={codeShare}
          onChange={() => setCodeShare(!codeShare)}
        />{" "}
        Code Share
        <button>Search</button>
      </InputSection>

      <InputSection output={<p>Active US Airlines show here</p>}>
        <h2>Directions:</h2>
        <p>
          <strong>
            Check mark if you want active airlines in the United States
          </strong>
        </p>
        <p>
          Details: A list of airlines operating within the United States appears
        </p>
        <input
          type="checkbox"
          checked={activeUS}
          onChange={() => setActiveUS(!activeUS)}
        />{" "}
        Active US Airlines
        <button>Search</button>
      </InputSection>

      <div className="category">
        <h2>Airline Aggregation</h2>
        <p>Search for information regarding multiple airports and airlines</p>
      </div>

      <InputSection output={<p>Highest airport density result</p>}>
        <h2>Directions:</h2>
        <p>
          <strong>
            Checkmark to see the country/territory with the highest airport
            density
          </strong>
        </p>
        <p>
          Details: The country/territory that contains the highest number of
          airports appears
        </p>
        <input
          type="checkbox"
          checked={airportDensity}
          onChange={() => setAirportDensity(!airportDensity)}
        />{" "}
        Airport Density
        <button>Search</button>
      </InputSection>

      <InputSection output={<p>Most incoming/outgoing airline cities</p>}>
        <h2>Directions:</h2>
        <p>
          <strong>
            Checkmark to see the top k cities with the most incoming/outgoing
            airlines
          </strong>
        </p>
        <p>
          Details: The cities with the most incoming/outgoing airlines appear
        </p>
        <input
          type="checkbox"
          checked={airportTraffic}
          onChange={() => setAirportTraffic(!airportTraffic)}
        />{" "}
        Airport Traffic
        <button>Search</button>
      </InputSection>

      <div className="category">
        <h2>Trip Recommendation</h2>
        <p>Search for the most optimal routes regarding your trip</p>
      </div>

      <InputSection output={<p>List of routes</p>}>
        <h2>Directions:</h2>
        <p>
          <strong>
            Enter the two cities to find a trip that connects them
          </strong>
        </p>
        <p>Details: A list of routes that connects two cities will appear</p>
        <input
          type="text"
          value={city1}
          onChange={(e) => setCity1(e.target.value)}
          placeholder="City departing"
        />
        <input
          type="text"
          value={city2}
          onChange={(e) => setCity2(e.target.value)}
          placeholder="City arriving"
        />
        <button>Search</button>
      </InputSection>

      <InputSection output={<p>Routes with less than {tripStops} stops</p>}>
        <h2>Directions:</h2>
        <p>
          <strong>
            Enter the two cities to find a trip with less than X stops
          </strong>
        </p>
        <p>
          Details: A list of routes that connects two cities will appear with
          fewer than the specified number of stops
        </p>
        <input
          type="text"
          value={city1}
          onChange={(e) => setCity1(e.target.value)}
          placeholder="City departing"
        />
        <input
          type="text"
          value={city2}
          onChange={(e) => setCity2(e.target.value)}
          placeholder="City arriving"
        />
        <input
          type="number"
          value={tripStops}
          onChange={(e) => setTripStops(e.target.value)}
          placeholder="Trip Stops"
        />
        <button>Search</button>
      </InputSection>

      <InputSection output={<p>Reachable cities within {distance} miles</p>}>
        <h2>Directions:</h2>
        <p>
          <strong>
            Enter the departing city and the search area distance (in miles)
          </strong>
        </p>
        <p>
          Details: A list of routes reachable from the departing city within the
          given distance appears
        </p>
        <input
          type="text"
          value={city1}
          onChange={(e) => setCity1(e.target.value)}
          placeholder="City departing"
        />
        <input
          type="number"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          placeholder="Distance"
        />
        <button>Search</button>
      </InputSection>

      <InputSection output={<p>Route confirmation: {result ? "Yes" : "No"}</p>}>
        <h2>Directions:</h2>
        <p>
          <strong>
            Enter the two cities to check if a trip that connects them is
            possible
          </strong>
        </p>
        <p>
          Details: A yes or no will appear notifying if there is a route between
          the two cities
        </p>
        <input
          type="text"
          value={city1}
          onChange={(e) => setCity1(e.target.value)}
          placeholder="City departing"
        />
        <input
          type="text"
          value={city2}
          onChange={(e) => setCity2(e.target.value)}
          placeholder="City arriving"
        />
        <p> </p>
        <input
          type="checkbox"
          checked={result}
          onChange={() => setResult(!result)}
        />{" "}
        Result
        <button>Search</button>
      </InputSection>
    </div>
  );
}

export default App;
