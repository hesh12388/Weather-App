// Longterm.js
import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import './styles/Longterm.css';
import Nav from './Nav';

function LongTerm() {
  //for storing KP index data
  const [kpIndexData, setKpIndexData] = useState([]);

  // Object containing colors to probability
  const keyData = {
    'red': 'Low Probability',
    'orange': 'Medium Probability',
    'green': 'High Probability'
  };

  //Hook which fetches KP index data on component mount
  useEffect(() => {
    const fetchKpIndexData = async () => {
      try {
        // Fetches data from a local file
        const response = await fetch('/27DO.txt');

        const text = await response.text(); // Reading the response as text
        console.log(text);
        const lines = text.split('\n'); 
        const parsedData = lines.reduce((acc, line) => {
          if (line.startsWith('2024')) { // Filtering lines starting with "2024"
            const parts = line.split(/\s+/); 
            const dateString = parts.slice(0, 3).join(' '); // "YYYY MMM DD"
            const date = new Date(dateString).toISOString().split('T')[0]; // Formatting the date
            const kpIndex = parseInt(parts[parts.length - 1], 10); // Parsing the KP index
            const color = kpIndex > 5 ? 'green' : kpIndex >= 3 ? 'orange' : 'red'; // Assigning a color based on KP index
            acc.push({ date, kpIndex, color }); // Adding the parsed data to the accumulator
          }
          return acc;
        }, []);
        setKpIndexData(parsedData); // Sets the state with the parsed data
      } catch (error) {
        console.error("Failed to fetch Kp index data:", error); // Logging errors to the console
      }
    };
  
    fetchKpIndexData();
  }, []); 
  // Render method returning JSX
  return (
    <div className="app">
      <div className="forecast-container">
        <div className="forecast-header"><h3>Long-Term<br/>Forecast</h3></div>
        <div className="kp-index-header">KP Index</div>
        <div className="Cal">
          <Calendar kpIndexData={kpIndexData} /> {/* Passing KP index data to Calendar component */}
        </div>
        <div className="key-section">
          <div className="kp-index-header">Key</div>
          {/* Mapping over keyData object to display probability keys */}
          {Object.entries(keyData).map(([color, label]) => (
            <div key={color} className="key-item">
              <span className={`color-indicator ${color}`}></span> {/* Displaying color indicator */}
              {label}
            </div>
          ))}
        </div>
      </div>
      <Nav/>
    </div>
  );
}

export default LongTerm;
