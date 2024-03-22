import React from 'react';
import { BrowserRouter as Router,Route, Routes} from "react-router-dom";
import { useState, createContext} from 'react';
import WeatherPage from "./WeatherPage";
import BestLocations from "./BestLocations";
import PinnedLocations from './PinnedLocations';
import CostPlanner from './costPlanner';
import LongTerm from "./Longterm";
export const LocationContext= createContext();
function App(){
    // this is the variables and methods that we want to share across multiples pages
    const [location, setLocation] = useState("Oslo");
    const [pinnedLocations, setPinnedLocations] = useState(["Oslo", "London"]);
    return (
      //Used React Router to navigate between pages and wrapped router in Context provider so that multiple
      // pages can know the location
 
        <LocationContext.Provider value={{location, setLocation, pinnedLocations, setPinnedLocations}}>
        <Router>
                <Routes>
                  <Route index element={<WeatherPage />} />
                  <Route exact path="/bestLocations" element ={<BestLocations/>}/>
                  <Route exact path="/pinnedLocations" element ={<PinnedLocations/>}/>
                  <Route exact path="/costPlanner" element ={<CostPlanner/>}/>
                  <Route exact path="/longForecast" element ={<LongTerm/>}/>
                </Routes>
        </Router>
        </LocationContext.Provider>
    );

}


export default App;