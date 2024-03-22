
import React, {useEffect, useState, useCallback, useContext} from 'react';
import axios from 'axios';
import './styles/WeatherPage.css';
import Header from './Header';
import Body from './Body';
import {LocationContext} from './App';
import searchButton from './images/search.png';
import pin from './images/pinLoc.png';
import List from './images/list.png';
import {Link} from 'react-router-dom';
export default function WeatherPage() { 

  // we destructure the context object in order to get the context that we need
  const {location, setLocation, pinnedLocations, setPinnedLocations} = useContext(LocationContext);
  //we need to keep track of the weather data so we use state to do this
  const[weatherData, setWeatherData] = useState(null);

  // This method is to retrieve the weather data from openweathermap and store it in the weatherData state
  //we wrap the method in method in useCallback and set the dependency to be location
  // This means that when the location variable changes, the function fetchData will change
  const fetchData = useCallback(async () => {
  try{
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=3a033236f4f8307f5a37e24b25696226`);
    setWeatherData(response.data);
  }

  catch(error){
    setLocation("Error");
    setWeatherData(null);
    console.error(error);
  }

}, [location]);

// we use useEffect to call the fetchData function when fetchData changes
// fetchData only changes when location changes
// So essentially we will fetch the data when the location changes
useEffect(() =>{ 
  fetchData();
}, [fetchData]);


// when the user submits, we retrieve the value from the form 
// then we use the setLocation method to set the location
// this will change the location and thus will cause weather data to be fetched for this location
const handleLocationSubmit = (e) =>{
  e.preventDefault();
  const input =document.getElementById("city").value;
  setLocation(input);
}

// when the user clicks on the pin button, we will add it to the pinnedLocations variable
//this is given that the city the user wants to add is valid and is not already in the pinned locations
function handleAddPin(){
  const input =document.getElementById("city").value;
  if((pinnedLocations.includes(input))==false){
      const new_locations =pinnedLocations;
      new_locations.push(input);
      setPinnedLocations(new_locations);
    }
  }


return(
  <div id="main">
      <form class="searchBar">
        <Link to="/pinnedLocations">
          <img src={List} alt="list" id="list-button"/>
        </Link>
        <div id="search-bar-inner">
          <input type="text" placeholder="Enter City Name" id="city"/>
          <button type="button" onClick={handleLocationSubmit}>
                <img id="search-button" src={searchButton} alt="Search" />
          </button>
        </div>
      
        <img id="pin-button" src={pin} alt="pin" onClick={ () => {handleAddPin();}}/>
      </form>
    {/* If the weather data is not null, we pass in variables as props to the header component and Body component */}
    {weatherData ? (
      <>
    
        <Header CityName={location} Temperature={weatherData.main.temp} HighTemp={weatherData.main.temp_max} LowTemp={weatherData.main.temp_min} Description={weatherData.weather[0].description}/>
        <Body Latitude={weatherData.coord.lat} Longitude={weatherData.coord.lon} CloudCover={weatherData.clouds.all} City={location} />
     
      </>
    ) :
    (
      // If the weather data is null, we just pass in fake variables until the weather data becomes not null
      <>
        <Header CityName={location} Temperature={0} HighTemp={0} LowTemp={0} Description={""}/>
        <Body Latitude={0} Longitude={0} CloudCover={0} City={null} />
      </>
    )
    }

  </div>
);
};
