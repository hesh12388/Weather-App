import React, {useState, useEffect } from 'react';
import AuroraForecast from './AuroraForecast';
import './Body.css';
import WeatherWidget from './weatherWidget';
import cloudcover from './cloudcover.png';
import windIcon from './windspeed.png';
import axios from 'axios';
import Nav from "./Nav";
import KpWidget from './kpWidget';
export default function Body({Latitude, Longitude, CloudCover, City}){

    Latitude = Math.round(Latitude);
    Longitude = Math.round(Longitude);

    let clouddesc="";
    if(CloudCover>87.5){
        clouddesc="Cloudy";
    }
    else if(CloudCover>62.5){
        clouddesc="Mostly Cloudy";
    }
    else if(CloudCover>37.5){
        clouddesc="Partly Cloudy";
    }

    else if(CloudCover>12.5){
        clouddesc="Mostly Clear";
    }
    else{
        clouddesc="Clear";
    }

   
    
const[windSpeed, setWindSpeed]= useState(0)
async function fecthWindSpeed(){
    try{
        const response = await axios.get(`https://services.swpc.noaa.gov/products/solar-wind/plasma-5-minute.json`);
        const arr =response.data
        console.log(arr, arr.length);
        if (arr.length>1){
            setWindSpeed(arr.slice(1)[0][2]);
        }
      
    }

    catch(error){
        console.error(error);
    }
 
}
let winddesc="";
if (windSpeed>500){
    winddesc="Very High"
}

else if(windSpeed>400){
    winddesc="High"
}

else if(windSpeed>300){
    winddesc="Moderate"
}

else if(windSpeed>200){
    winddesc="Low"
}

else{
    winddesc="Very Low"
}

let windpercentage = (windSpeed/600)*100;
useEffect(()=>{
fecthWindSpeed();
setInterval(fecthWindSpeed, 60000);
}, []);


   
    return(
        <div class="body">
        <AuroraForecast Latitude={Latitude} Longitude={Longitude} city={City}/>
        <div id ="WeatherWidgets">
            <WeatherWidget Icon={cloudcover}  Heading={"Cloud Cover"} Value={CloudCover} Description ={clouddesc} Percentage={CloudCover}/>
            <WeatherWidget Icon={windIcon}  Heading={"Wind Speed"} Value={windSpeed} Description ={winddesc} Percentage={windpercentage}/>
        </div>
        <KpWidget />
        <Nav/>
        </div>
    )
}