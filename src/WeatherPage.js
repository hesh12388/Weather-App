
import React, {useEffect, useState, useCallback} from 'react';
import axios from 'axios';
import './WeatherPage.css';
import Header from './Header';
import Body from './Body';
export default function WeatherPage() { 

  const [city, setCity] = useState('Svalbard')
  const[weatherData, setWeatherData] = useState(null)

  const fetchData = useCallback(async () => {
  try{
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=3a033236f4f8307f5a37e24b25696226`);
    setWeatherData(response.data);
  }

  catch(error){
    setWeatherData(null);
    console.error(error);
  }

}, [city]);


useEffect(() =>{
  fetchData();
}, [fetchData]);


const handleInputChange = (e) =>{
setCity(e.target.value);
}





return(
  <div id="main">

    <form id="searchBar">
      <input type="text" placeholder="Enter City Name" value={city} onChange={handleInputChange}/>
    </form>

    {weatherData ? (
      <>
       <Header CityName={city} Temperature={weatherData.main.temp} HighTemp={weatherData.main.temp_max} LowTemp={weatherData.main.temp_min} Description={weatherData.weather[0].description}/>
       <Body Latitude={weatherData.coord.lat} Longitude={weatherData.coord.lon} CloudCover={weatherData.clouds.all} City={city} />
      </>
    ) :
    (
      <>
        <Header CityName={city} Temperature={0} HighTemp={0} LowTemp={0} Description={""}/>
        <Body Latitude={0} Longitude={0} CloudCover={0} City={null} />
      </>
    )
    }

  </div>
);
};
