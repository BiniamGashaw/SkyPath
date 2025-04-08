import React, { useState } from "react";
import "./App.css";

function App() {
  const [country, setCountry] = useState("");
  const [stops, setStops] = useState("");
  const [codeShare, setCodeShare] = useState(false);
  const [activeUS, setActiveUS] = useState(false);

  return (
    <div className="app">
      <header className="header">
        <img src="/plane-icon.png" alt="Plane icon" className="logo" />
        <h1>SKYPATH</h1>
      </header>

      <div className="section">
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
      </div>

      <div className="section">
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
      </div>

      <div className="section">
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
      </div>

      <div className="section">
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
      </div>
    </div>
  );
}

export default App;
