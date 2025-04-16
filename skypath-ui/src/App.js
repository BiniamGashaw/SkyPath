import React, { useState } from "react";
import "./App.css";
import planeLogo from "./logo3.webp";

import airlines from "./data/airlines";
import countries from "./data/countries";
import airports from "./data/airports";
import planes from "./data/planes";
import routes from "./data/routes";

import {
  filterByCountry,
  filterByStops,
  filterByCodeShare,
  filterByActiveUS,
  filterBetweenCities,
  filterByTripStops,
  filterByDistance,
  getAirportDensityByCountry,
  getAirportTrafficByCity,
} from "./utils/filters";

// Reusable isolated section
function InputSection({ children, output }) {
  return (
    <div className="section row">
      <div className="input-group">{children}</div>
      <div className="output-box">
        {Array.isArray(output) ? (
          output.map((item, i) => <p key={i}>{item}</p>)
        ) : (
          <p>{output}</p>
        )}
      </div>
    </div>
  );
}

function App() {
  const [airportDensity, setAirportDensity] = useState(false);
  const [airportTraffic, setAirportTraffic] = useState(false);
  const [result, setResult] = useState(false);

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

      <CountrySearch />
      <StopsSearch />
      <CodeShareSearch />
      <ActiveUSSearch />

      <div className="category">
        <h2>Airline Aggregation</h2>
        <p>Search for information regarding multiple airports and airlines</p>
      </div>

      <InputSection
        output={
          airportDensity
            ? (() => {
                const top = getAirportDensityByCountry();
                return top
                  ? [
                      `🌍 ${top.country} has the highest airport density (${top.count} airports)`,
                    ]
                  : ["No data available"];

              })()
            : []
        }
      >
        <>
          <h2>Directions:</h2>
          <p>
            <strong>Airport Density</strong>
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
        </>
      </InputSection>

      <InputSection output={airportTraffic ? getAirportTrafficByCity() : []}>
        <>
          <h2>Directions:</h2>
          <p>
            <strong>Airport Traffic</strong>
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
        </>
      </InputSection>

      <div className="category">
        <h2>Trip Recommendation</h2>
        <p>Search for the most optimal routes regarding your trip</p>
      </div>

      <RouteSearch />
      <LimitedStopSearch />
      <ReachableSearch />
      <TripConfirm setResult={setResult} result={result} />
    </div>
  );
}

function CountrySearch() {
  const [country, setCountry] = useState("");
  const [output, setOutput] = useState([]);

  return (
    <InputSection output={output}>
      <>
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
        <button
          onClick={() => {
            const res = filterByCountry(airlines, country);
            setOutput(
              res.length
                ? res.map((a) => `${a.name} (${a.country})`)
                : [`No airlines found for ${country}`]
            );
          }}
        >
          Search
        </button>
      </>
    </InputSection>
  );
}

function StopsSearch() {
  const [stops, setStops] = useState("");
  const [output, setOutput] = useState([]);

  return (
    <InputSection output={output}>
      <>
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
        <button
          onClick={() => {
            const res = filterByStops(airlines, stops);
            setOutput(
              res.length
                ? res.map((a) => `${a.name} - ${a.stops} stops`)
                : [`No airlines with ${stops} stops`]
            );
          }}
        >
          Search
        </button>
      </>
    </InputSection>
  );
}

function CodeShareSearch() {
  const [checked, setChecked] = useState(false);
  const [output, setOutput] = useState([]);

  const handleToggle = () => {
    const nextChecked = !checked;
    setChecked(nextChecked);

    const res = nextChecked ? filterByCodeShare(airlines) : [];
    setOutput(nextChecked ? res.map((a) => `${a.name} (Code Share)`) : []);
  };

  return (
    <InputSection output={output}>
      <>
        <h2>Directions:</h2>
        <p>
          <strong>Check mark if code share is wanted</strong>
        </p>
        <p>Details: A list of airlines operating with code share appears</p>
        <input type="checkbox" checked={checked} onChange={handleToggle} /> Code
        Share
      </>
    </InputSection>
  );
}

function ActiveUSSearch() {
  const [checked, setChecked] = useState(false);
  const [output, setOutput] = useState([]);

  const handleToggle = () => {
    const nextValue = !checked;
    setChecked(nextValue);
    const res = nextValue ? filterByActiveUS(airlines) : [];

    setOutput(nextValue ? res.map((a) => `${a.name} (Active US)`) : []);
  };

  return (
    <InputSection output={output}>
      <>
        <h2>Directions:</h2>
        <p>
          <strong>
            Check mark if you want active airlines in the United States
          </strong>
        </p>
        <p>
          Details: A list of airlines operating within the United States appears
        </p>
        <input type="checkbox" checked={checked} onChange={handleToggle} />{" "}
        Active US Airlines
      </>
    </InputSection>
  );
}

function RouteSearch() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [output, setOutput] = useState([]);

  return (
    <InputSection output={output}>
      <>
        <h2>Directions:</h2>
        <p>
          <strong>
            Enter the two cities to find a trip that connects them
          </strong>
        </p>
        <p>Details: A list of routes that connects two cities will appear</p>
        <input
          type="text"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="City departing"
        />
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="City arriving"
        />
        <button
          onClick={() => {
            const res = filterBetweenCities(airlines, from, to);
            setOutput(
              res.length
                ? res.map((a) => `${a.name} connects ${from} → ${to}`)
                : [`No routes from ${from} to ${to}`]
            );
          }}
        >
          Search
        </button>
      </>
    </InputSection>
  );
}

function LimitedStopSearch() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [stops, setStops] = useState("");
  const [output, setOutput] = useState([]);

  return (
    <InputSection output={output}>
      <>
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
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="City departing"
        />
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="City arriving"
        />
        <input
          type="number"
          value={stops}
          onChange={(e) => setStops(e.target.value)}
          placeholder="Trip Stops"
        />
        <button
          onClick={() => {
            const res = filterByTripStops(airlines, from, to, stops);
            setOutput(
              res.length
                ? res.map(
                    (a) => `${a.name} - ${a.stops} stops from ${from} → ${to}`
                  )
                : [`No routes under ${stops} stops between ${from} and ${to}`]
            );
          }}
        >
          Search
        </button>
      </>
    </InputSection>
  );
}

function ReachableSearch() {
  const [city, setCity] = useState("");
  const [distance, setDistance] = useState(""); // Not used in filter currently
  const [output, setOutput] = useState([]);

  return (
    <InputSection output={output}>
      <>
        <h2>Directions:</h2>
        <p>
          <strong>
            Enter the departing city and the search area distance (in miles)
          </strong>
        </p>
        <p>
          Details: A list of routes reachable from the departing city appears
        </p>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City departing"
        />
        <input
          type="number"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          placeholder="Distance"
        />
        <button
          onClick={() => {
            const res = filterByDistance(airlines, city); // Assume filters handle distance
            setOutput(
              res.length
                ? res.map(
                    (a) => `${a.name} can reach ${a.destCity} from ${city}`
                  )
                : [`No cities reachable from ${city}`]
            );
          }}
        >
          Search
        </button>
      </>
    </InputSection>
  );
}

function TripConfirm() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [output, setOutput] = useState([]);

  return (
    <InputSection output={output}>
      <>
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
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="City departing"
        />
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="City arriving"
        />
        <button
          onClick={() => {
            const res = filterBetweenCities(airlines, from, to);
            const exists = res.length > 0;
            setOutput([exists ? "✅ Route exists" : "❌ No direct route"]);
          }}
        >
          Search
        </button>
      </>
    </InputSection>
  );
}

export default App;
