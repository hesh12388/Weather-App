import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import star from './images/thinsmooth.png';
import helpbutton from './images/Vector.png';
import slider from './images/slider.png';
import pointer from './images/Ellipse.png';
import './styles/AuroraForecast.css';
import AnimatedPage from './AnimatedPage';
import arrow from "./images/arrow.png";
import {Link} from 'react-router-dom';
export default function AuroraForecast({Latitude, Longitude, city}){

    // this is finding the index of the array of coordinates for a given latitude and longitude
    // this was difficult since noaa used a different standard for latitude and longitude
    if (Longitude>=0){
        Longitude = (Longitude *181) + 32580;
    }
    else{
        Longitude = Longitude *-1;
        Longitude = 32580 -(Longitude*181);
    };

    Latitude = Latitude +90;
    // we keep the auroraForecast variable as a state
    const [auroraForecast, setAuroraForecast] = useState(0);

    // this none !important;ions finds the aurora forecast for given latitude and longitude
    // we wrap it in usecallback so that this function changes every time the city changes
    const fetchAurora = useCallback(async () =>{
        try{
        
        if(city==null)
        {
            throw new Error;
        }
        const response = await axios.get(`https://services.swpc.noaa.gov/json/ovation_aurora_latest.json`);
        const auroraforecast = response.data.coordinates[Latitude+Longitude][2];
        setAuroraForecast(auroraforecast);
        }
        catch(error){
            setAuroraForecast(0); 
            console.error(error);
        }
    }, [city]);

    //when the fetchAurora function changes, we call it
    // the fetchAurora function changes only when the city changes
    // so essentially the fetchAurora function is called when the city changes
    useEffect(()=>{
        fetchAurora();
    }, [fetchAurora]);

    // this css style is used for the pointer on the slider
    // the pointer is positioned on the slider based on the value of the auroraforecast
    const dynamicstyles ={
        right: `${99.5-auroraForecast}%`
    }

    function handleHelpButton(){
        const helpmessage = document.getElementById('helpMessage');
        const helpButton = document.getElementById('helpButton');
        const title = document.getElementById('auroraHeading');
        title.style.display = 'none';
        helpButton.style.display ='none';
        helpmessage.style.display = 'inline';
    }

    function handleHelpButtonOut(){
        const helpmessage = document.getElementById('helpMessage');
        const helpButton = document.getElementById('helpButton');
        const title = document.getElementById('auroraHeading');
        helpmessage.style.display = 'none';
        helpButton.style.display ='inline';
        title.style.display = 'flex';
    }

    return(

            <AnimatedPage>
                <div class="auroraForecast">
                    <header id="title">
                        <div id="auroraHeading">
                            <img src={star} alt='star' width='21.15' height='20.04'></img>
                            <section>Aurora Forecast</section>
                        </div>
                        <img src={helpbutton} alt='helpButton' id="helpButton" onMouseOver={()=>{handleHelpButton();}} onMouseOut={()=>{handleHelpButtonOut();}}></img>
                        <section id="helpMessage">
                            % of Aurora Visbility. Higher equals Better!
                        </section>
                    </header>
                    <section id="Forecast">
                        {auroraForecast}%
                    </section>
                    <div id="flex-container">
                        <div>
                            <img src={slider} alt='slider' id="slider"></img>
                            <img src ={pointer} alt='pointer' id="pointer" style={dynamicstyles}></img>
                        </div>

                        <Link to="/bestLocations" id="link">
                            <figure id="arrow-fig">
                                <img src={arrow} alt="arrowButton" id="figure1"  class="arrow"/>
                            </figure>
                        </Link>
                    </div>
                </div>
        </AnimatedPage>
    )
}