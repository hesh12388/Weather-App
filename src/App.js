import React from 'react';
import { BrowserRouter as Router,Route, Routes, Link} from "react-router-dom";
import WeatherPage from "./WeatherPage";
import './App.css';
import BestLocations from "./BestLocations";
function App(){
    return (
      <Router>
        <div class="main">
            <Routes>
              <Route index element={<WeatherPage />} />
              <Route exact path="/longForecast" element ={<BestLocations/>}/>
            </Routes>
        </div>
      </Router>
    );
}


export default App;