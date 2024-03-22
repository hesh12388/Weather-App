import React, {useState, useEffect } from 'react';
import AuroraForecast from './AuroraForecast';
import './styles/Body.css';
import WeatherWidget from './weatherWidget';
import cloudcover from './images/cloudcover.png';
import windIcon from './images/windspeed.png';
import axios from 'axios';
import Nav from "./Nav";
import KpWidget from './kpWidget';
import AnimatedPage from './AnimatedPage';
export default function Body({Latitude, Longitude, CloudCover, City}){

    Latitude = Math.round(Latitude);
    Longitude = Math.round(Longitude);

    // here were setting the cloud cover description based on
    // what the value of the cloud cover is
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

   

//  here we're fetching the solar wind speed from noaa 
// we specify the function as async so that we can use the await inside the function
// to wait for the api call to be complete and respond
const[windSpeed, setWindSpeed]= useState(0)
async function fecthWindSpeed(){
    try{
        const response = await axios.get(`https://services.swpc.noaa.gov/products/solar-wind/plasma-5-minute.json`);
        const arr =response.data
        if (arr.length>1){
            setWindSpeed(arr.slice(1)[0][2]);
        }
      
    }

    catch(error){
        console.error(error);
    }
 
}

// we set the wind speed description based on the value of the windspeed we retrieved
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

// we set the percentage that the current windspeed is based on the maximum value of 600
// we need this percentage because it will determine where the pointer is on the slider
let windpercentage = (windSpeed/600)*100;


// useEffect with a dependency of an empty array means the method inside is called on render
//inside we use a setInterval method to call fetchWindSpeed function every 60 thousand milliseconds
// this is because the solar wind speed data is updated every couple of minutes by noaa so we
// must retrieve it consistently
useEffect(()=>{
fecthWindSpeed();
setInterval(fecthWindSpeed, 60000);
}, []);


   // the body component is made up of 3 components, the aurora forecast, two weather widgets, and one kp widget
   // we pass the required values of these components as props
    return(
        <div class="body">
        <div class="inner-body">
            <AuroraForecast Latitude={Latitude} Longitude={Longitude} city={City}/>
            <AnimatedPage>
                <div id ="WeatherWidgets">
                    <WeatherWidget Icon={cloudcover}  Heading={"Cloud Cover"} Value={CloudCover} Description ={clouddesc} Percentage={100-CloudCover}/>
                    <WeatherWidget Icon={windIcon}  Heading={"Wind Speed"} Value={windSpeed} Description ={winddesc} Percentage={windpercentage}/>
                </div>
            </AnimatedPage>
        
        <AnimatedPage>
                <KpWidget />

        </AnimatedPage>
        </div>
       
            <Nav/>

        </div>
    )
}