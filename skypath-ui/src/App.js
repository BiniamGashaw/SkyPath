import React, { useState } from "react";
import "./App.css";
import planeLogo from "./logo3.webp";

import airlines from "./data/airlines";
import {
  filterByCountry,
  filterByStops,
  filterByCodeShare,
  filterByActiveUS,
  filterBetweenCities,
  filterByTripStops,
  filterByDistance,
} from "./utils/filters";

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

  const InputSection = ({ children, handler }) => {
    const [localOutput, setLocalOutput] = useState([]);
    return (
      <div className="section row">
        <div className="input-group">
          {children(setLocalOutput)}
          <button onClick={() => handler(setLocalOutput)}>Search</button>
        </div>
        <div className="output-box">
          {Array.isArray(localOutput) ? (
            localOutput.map((o, i) => <p key={i}>{o}</p>)
          ) : (
            <p>{localOutput}</p>
          )}
        </div>
      </div>
    );
  };

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
        handler={(setOut) => {
          const res = filterByCountry(airlines, country);
          setOut(
            res.length
              ? res.map((a) => `${a.name} (${a.country})`)
              : [`No airlines found for ${country}`]
          );
        }}
      >
        {(setOut) => (
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
          </>
        )}
      </InputSection>

      <InputSection
        handler={(setOut) => {
          const res = filterByStops(airlines, stops);
          setOut(
            res.length
              ? res.map((a) => `${a.name} - ${a.stops} stops`)
              : [`No airlines with ${stops} stops`]
          );
        }}
      >
        {(setOut) => (
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
          </>
        )}
      </InputSection>

      <InputSection
        handler={(setOut) => {
          if (codeShare) {
            const res = filterByCodeShare(airlines);
            setOut(res.map((a) => `${a.name} (Code Share)`));
          } else {
            setOut(["Code Share not selected"]);
          }
        }}
      >
        {(setOut) => (
          <>
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
          </>
        )}
      </InputSection>

      <InputSection
        handler={(setOut) => {
          if (activeUS) {
            const res = filterByActiveUS(airlines);
            setOut(res.map((a) => `${a.name} (Active US)`));
          } else {
            setOut(["Active US not selected"]);
          }
        }}
      >
        {(setOut) => (
          <>
            <h2>Directions:</h2>
            <p>
              <strong>
                Check mark if you want active airlines in the United States
              </strong>
            </p>
            <p>
              Details: A list of airlines operating within the United States
              appears
            </p>
            <input
              type="checkbox"
              checked={activeUS}
              onChange={() => setActiveUS(!activeUS)}
            />{" "}
            Active US Airlines
          </>
        )}
      </InputSection>

      <div className="category">
        <h2>Airline Aggregation</h2>
        <p>Search for information regarding multiple airports and airlines</p>
      </div>

      <InputSection
        handler={(setOut) => {
          setOut(
            airportDensity
              ? ["🇺🇸 United States has the highest airport density (demo data)"]
              : ["Airport density not selected"]
          );
        }}
      >
        {(setOut) => (
          <>
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
          </>
        )}
      </InputSection>

      <InputSection
        handler={(setOut) => {
          setOut(
            airportTraffic
              ? ["Top cities with most traffic (mock): New York, Dubai, Berlin"]
              : ["Airport traffic not selected"]
          );
        }}
      >
        {(setOut) => (
          <>
            <h2>Directions:</h2>
            <p>
              <strong>
                Checkmark to see the top k cities with the most
                incoming/outgoing airlines
              </strong>
            </p>
            <p>
              Details: The cities with the most incoming/outgoing airlines
              appear
            </p>
            <input
              type="checkbox"
              checked={airportTraffic}
              onChange={() => setAirportTraffic(!airportTraffic)}
            />{" "}
            Airport Traffic
          </>
        )}
      </InputSection>

      <div className="category">
        <h2>Trip Recommendation</h2>
        <p>Search for the most optimal routes regarding your trip</p>
      </div>

      <InputSection
        handler={(setOut) => {
          const res = filterBetweenCities(airlines, city1, city2);
          setOut(
            res.length
              ? res.map((a) => `${a.name} connects ${city1} → ${city2}`)
              : [`No routes from ${city1} to ${city2}`]
          );
        }}
      >
        {(setOut) => (
          <>
            <h2>Directions:</h2>
            <p>
              <strong>
                Enter the two cities to find a trip that connects them
              </strong>
            </p>
            <p>
              Details: A list of routes that connects two cities will appear
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
          </>
        )}
      </InputSection>

      <InputSection
        handler={(setOut) => {
          const res = filterByTripStops(airlines, city1, city2, tripStops);
          setOut(
            res.length
              ? res.map(
                  (a) => `${a.name} - ${a.stops} stops from ${city1} → ${city2}`
                )
              : [
                  `No routes under ${tripStops} stops between ${city1} and ${city2}`,
                ]
          );
        }}
      >
        {(setOut) => (
          <>
            <h2>Directions:</h2>
            <p>
              <strong>
                Enter the two cities to find a trip with less than X stops
              </strong>
            </p>
            <p>
              Details: A list of routes that connects two cities will appear
              with fewer than the specified number of stops
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
          </>
        )}
      </InputSection>

      <InputSection
        handler={(setOut) => {
          const res = filterByDistance(airlines, city1);
          setOut(
            res.length
              ? res.map(
                  (a) => `${a.name} can reach ${a.destCity} from ${city1}`
                )
              : [`No cities reachable from ${city1}`]
          );
        }}
      >
        {(setOut) => (
          <>
            <h2>Directions:</h2>
            <p>
              <strong>
                Enter the departing city and the search area distance (in miles)
              </strong>
            </p>
            <p>
              Details: A list of routes reachable from the departing city within
              the given distance appears
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
          </>
        )}
      </InputSection>

      <InputSection
        handler={(setOut) => {
          const res = filterBetweenCities(airlines, city1, city2);
          const isPossible = res.length > 0;
          setResult(isPossible);
          setOut([isPossible ? "✅ Route exists" : "❌ No direct route"]);
        }}
      >
        {(setOut) => (
          <>
            <h2>Directions:</h2>
            <p>
              <strong>
                Enter the two cities to check if a trip that connects them is
                possible
              </strong>
            </p>
            <p>
              Details: A yes or no will appear notifying if there is a route
              between the two cities
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
          </>
        )}
      </InputSection>
    </div>
  );
}

export default App;
