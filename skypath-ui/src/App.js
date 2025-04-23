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
            Details: The top N cities with the most incoming/outgoing airlines
            appear
          </p>
          <input
            type="number"
            min="1"
            placeholder="Enter number of cities"
            onChange={(e) => {
              const value = e.target.value;
              if (!value || isNaN(value) || Number(value) <= 0) {
                setOutputTraffic([
                  "Please enter a valid number greater than 0",
                ]);
                setAirportTraffic(false);
                return;
              }

              setAirportTraffic(true);

              fetch(
                `http://localhost:5000/aggregation/Find_Cities_With_Most_Airlines?k=${value}`
              )
                .then((res) => res.json())
                .then((data) => {
                  if (Array.isArray(data)) {
                    setOutputTraffic(
                      data.map(
                        (entry, i) =>
                          `${i + 1}. ${entry.city}: ${
                            entry.total_routes
                          } routes`
                      )
                    );
                  } else {
                    setOutputTraffic(["No data returned"]);
                  }
                })
                .catch(() => {
                  setOutputTraffic(["Error fetching data"]);
                });
            }}
          />
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
  const [stops, setStops] = useState("1");
  const [output, setOutput] = useState([]);

  return (
    <InputSection output={output}>
      <>
        <h2>Directions:</h2>
        <p>
          <strong>Enter the minimum number of stops</strong>
        </p>
        <p>Details: Airlines with at least this many stops will appear</p>
        <input
          type="number"
          value={stops}
          onChange={(e) => setStops(e.target.value)}
          placeholder="Minimum stops"
        />
        <button
          onClick={() => {
            fetch(
              `http://localhost:5000/search/Find_Airlines_By_Stop?stops=${stops}`
            )
              .then((res) => res.json())
              .then((data) => {
                if (Array.isArray(data)) {
                  setOutput(
                    data.map((a, i) => `${i + 1}. ${a.name} (${a.airline})`)
                  );
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
          setOutput(
            data.map((a, i) => `${i + 1}. ${a.name} (${a.airline})`)
          );
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
        <input type="checkbox" checked={checked} onChange={handleToggle} />{" "}
        Code Share
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
          // Since you're now only selecting the name column
          setOutput(data.map((a, i) => `${i + 1}. ${a.name || a[0]}`));
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
            fetch(
              `http://localhost:5000/recommendation/Find_Trip_Between_Two_Cities?city1=${encodeURIComponent(
                from
              )}&city2=${encodeURIComponent(to)}`
            )
              .then((res) => res.json())
              .then((data) => {
                console.log("RouteSearch response:", data);

                if (Array.isArray(data)) {
                  const formattedRoutes = data.map((route, i) => {
                    const from = route.from || ["?", "?", "?", "?"];
                    const to = route.to || ["?", "?", "?", "?"];
                    const v1 = route.v1 || ["?", "?", "?", "?"];
                    const e0 = route.e0 || ["?", "?", "?", "?"];
                    const e1 = route.e1 || ["?", "?", "?", "?"];

                    return `Route ${i + 1}: From ${from[2]} (${
                      from[0]
                    }) → Midpoint: ${v1[2]} (${v1[0]}) → To: ${to[2]} (${
                      to[0]
                    }) | Leg 1: ${e0[0]} to ${e0[1]} via ${e0[2]} | Leg 2: ${
                      e1[0]
                    } to ${e1[1]} via ${e1[2]}`;
                  });

                  setOutput(formattedRoutes);
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
              `http://localhost:5000/recommendation/Find_Cities_Within_Stops?city=${encodeURIComponent(
                from
              )}&stops=${encodeURIComponent(stops)}`
            )
              .then((res) => res.json())
              .then((data) => {
                console.log("TripStopsSearch response:", data);

                if (Array.isArray(data)) {
                  const formattedRoutes = data.map((route, i) => {
                    const from = route.from || ["?", "?", "?", "?"];
                    const to = route.to || ["?", "?", "?", "?"];
                    const v1 = route.v1 || ["?", "?", "?", "?"];
                    const e0 = route.e0 || ["?", "?", "?", "?"];
                    const e1 = route.e1 || ["?", "?", "?", "?"];

                    return `Route ${i + 1}: From ${from[2]} (${
                      from[0]
                    }) → Midpoint: ${v1[2]} (${v1[0]}) → To: ${to[2]} (${
                      to[0]
                    }) | Leg 1: ${e0[0]} to ${e0[1]} via ${e0[2]} | Leg 2: ${
                      e1[0]
                    } to ${e1[1]} via ${e1[2]}`;
                  });

                  setOutput(formattedRoutes);
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
