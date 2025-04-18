import React, { useState } from "react";
import "./App.css";
import planeLogo from "./logo3.webp";


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
  const [outputDensity, setOutputDensity] = useState([]);
  const [airportDensity, setAirportDensity] = useState(false);
  const [airportTraffic, setAirportTraffic] = useState(false);
  const [outputTraffic, setOutputTraffic] = useState([]);

  
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

      {/* Country */}
      <CountrySearch />

      {/* Stops */}
      <StopsSearch />

      {/* Code Share */}
      <CodeShareSearch />

      {/* Active US */}
      <ActiveUSSearch />

      <div className="category">
        <h2>Airline Aggregation</h2>
        <p>Search for information regarding multiple airports and airlines</p>
      </div>

      {/* Density */}
      <InputSection output={outputDensity}>
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
            onChange={() => {
              setAirportDensity(!airportDensity);
              if (!airportDensity) {
                fetch(
                  "http://localhost:5000/aggregation/Find_Country_With_Most_Airports"
                )
                  .then((res) => res.json())
                  .then((data) => {
                    setOutputDensity([
                      `🌎 ${data.country} has the most airports`,
                    ]);
                  })
                  .catch(() => setOutputDensity(["Error fetching data"]));
              } else {
                setOutputDensity([]);
              }
            }}
          />{" "}
          Airport Density
        </>
      </InputSection>

      {/* Traffic */}
      <InputSection output={airportTraffic ? outputTraffic : []}>
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
            onChange={() => {
              const newValue = !airportTraffic;
              setAirportTraffic(newValue);

              if (newValue) {
                fetch(
                  "http://localhost:5000/aggregation/Find_Cities_With_Most_Airlines?k=5"
                )
                  .then((res) => res.json())
                  .then((data) => {
                    if (Array.isArray(data)) {
                      setOutputTraffic(
                        data.map(
                          (entry) =>
                            `${entry.city}: ${entry.total_routes} routes`
                        )
                      );
                    } else {
                      setOutputTraffic(["No data returned"]);
                    }
                  })
                  .catch(() => {
                    setOutputTraffic(["Error fetching data"]);
                  });
              } else {
                setOutputTraffic([]);
              }
            }}
          />{" "}
          Airport Traffic
        </>
      </InputSection>

      <div className="category">
        <h2>Trip Recommendation</h2>
        <p>Search for the most optimal routes regarding your trip</p>
      </div>

      {/* Routes */}
      <RouteSearch />

      {/* Routes with limited stops */}
      <LimitedStopSearch />

      {/* Hops reachable */}
      <ReachableSearch />
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
            fetch(
              `http://localhost:5000/search/Find_Airport_By_Country?country=${encodeURIComponent(
                country
              )}`
            )
              .then((res) => {
                if (!res.ok) {
                  throw new Error(`Server responded with ${res.status}`);
                }
                return res.json();
              })
              .then((data) => {
                console.log("✅ API response:", data);
                if (Array.isArray(data) && data.length > 0) {
                  setOutput(data.map((a) => `${a.name} (${a.city})`));
                } else if (Array.isArray(data)) {
                  setOutput([`No airports found for ${country}`]);
                } else {
                  setOutput([data.message || "Unexpected response"]);
                }
              })
              .catch((err) => {
                console.error("❌ Fetch error:", err);
                setOutput(["An error occurred."]);
              });
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
            fetch(
              `http://localhost:5000/search/Find_Airlines_By_Stop?stops=${stops}`
            )
              .then((res) => res.json())
              .then((data) => {
                if (Array.isArray(data)) {
                  setOutput(data.map((a) => `${a.airline}`));
                } else {
                  setOutput([data.message || "No data returned"]);
                }
              })
              .catch(() => setOutput(["An error occurred."]));
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

    if (!nextChecked) {
      setOutput([]);
      return;
    }

    fetch("http://localhost:5000/search/Find_Airlines_With_Code_Share")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOutput(data.map((a) => `${a.airline}`));
        } else {
          setOutput([data.message || "No data returned"]);
        }
      })
      .catch(() => setOutput(["An error occurred."]));
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
    const nextChecked = !checked;
    setChecked(nextChecked);

    if (!nextChecked) {
      setOutput([]);
      return;
    }

    fetch("http://localhost:5000/search/Find_Active_Airlines_In_United_State")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOutput(data.map((a) => `${a.airline}`));
        } else {
          setOutput([data.message || "No data returned"]);
        }
      })
      .catch(() => setOutput(["An error occurred."]));
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

  const formatRoute = (route, index) => {
    const from = route["from"];
    const to = route["to"];
    const e0 = route["e0"];
    const v1 = route["v1"];
    const e1 = route["e1"];

    if (from && to && e0 && !e1) {
      // Direct flight
      return `${index + 1}. From ${from.city} (${from.id}) to ${to.city} (${
        to.id
      }) via airline ${e0.airline}`;
    } else if (from && to && e0 && e1 && v1) {
      // 1-stop trip
      return `${index + 1}. From ${from.city} (${from.id}) to ${v1.city} (${
        v1.id
      }) via ${e0.airline}, then to ${to.city} (${to.id}) via ${e1.airline}`;
    } else {
      return `${index + 1}. Invalid route data`;
    }
  };


  return (
    <InputSection output={output}>
      <>
        <h2>Directions:</h2>
        <p>
          <strong>Enter the two cities to find a trip that connects them</strong>
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
            fetch(
              `http://localhost:5000/recommendation/Find_Trip_Between_Two_Cities?city1=${encodeURIComponent(
                from
              )}&city2=${encodeURIComponent(to)}`
            )
              .then((res) => res.json())
              .then((data) => {
                console.log("RouteSearch response:", data);

                if (Array.isArray(data)) {
                  setOutput(
                    data.map((route, i) => {
                      const fromCity = route.from?.city || "Unknown";
                      const fromId = route.from?.id || "??";

                      const toCity = route.to?.city || "Unknown";
                      const toId = route.to?.id || "??";

                      const airline1 = route.e0?.airline || "??";
                      const midCity = route.v1?.city || "Unknown";
                      const airline2 = route.e1?.airline || "??";

                      return `${
                        i + 1
                      }. From ${fromCity} (${fromId}) to ${midCity} via airline ${airline1}, then to ${toCity} (${toId}) via airline ${airline2}`;
                    })
                  );
                } else {
                  setOutput([data.message || "No routes found"]);
                }
              })

              .catch(() => setOutput(["An error occurred."]));
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
            fetch(
              `http://localhost:5000/recommendation/Find_Trip_Between_Two_Cities_In_Stops?city1=${encodeURIComponent(
                from
              )}&city2=${encodeURIComponent(to)}&stops=${stops}`
            )
              .then((res) => res.json())
              .then((data) => {
                if (Array.isArray(data)) {
                  setOutput(
                    data.map(
                      (trip, i) =>
                        `${i + 1}. ${trip.source_city} → ${
                          trip.destination_city
                        } via ${trip.airline} (${trip.stops} stops)`
                    )
                  );
                } else {
                  setOutput([data.message || "No route found"]);
                }
              })
              .catch(() => setOutput(["Error fetching routes"]));
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
  const [hops, setHops] = useState("");
  const [output, setOutput] = useState([]);
  return (
    <InputSection output={output}>
      <>
        <h2>Directions:</h2>
        <p>
          <strong>
            Enter the departing city and the amount of hops wanted.
          </strong>
        </p>
        <p>
          Details: A list of cities reachable from the departing city within the
          given amount of hops appears
        </p>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City departing"
        />
        <input
          type="number"
          value={hops}
          onChange={(e) => setHops(e.target.value)}
          placeholder="Hops"
        />
        <button
          onClick={() => {
            fetch(
              `http://localhost:5000/recommendation/Find_Cities_Within_Stops?city=${encodeURIComponent(
                city
              )}&stops=${hops}`
            )
              .then((res) => res.json())
              .then((data) => {
                console.log(data); 
                if (Array.isArray(data)) {
                  data.forEach((item, index) =>
                    console.log(`Item ${index}:`, item)
                  );

                  setOutput(
                    data.map((d, i) => {
                      const city =
                        d.city || d.destination || d.to_city || d.name || d.id;
                      return `${i + 1}. ${city}`;
                    })
                  );
                } else {
                  setOutput([data.message || "No cities found"]);
                }
              })
              .catch(() => setOutput(["Error fetching reachable cities"]));
          }}
        >
          Search
        </button>
      </>
    </InputSection>
  );
}



export default App;
