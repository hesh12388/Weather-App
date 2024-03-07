import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import star from './thinsmooth.png';
import helpbutton from './Vector.png';
import slider from './slider.png';
import pointer from './Ellipse.png';
import './AuroraForecast.css';
export default function AuroraForecast({Latitude, Longitude, city}){
    if (Longitude>=0){
        Longitude = (Longitude *181) + 32580;
    }
    else{
        Longitude = Longitude *-1;
        Longitude = 32580 -(Longitude*181);
    };

    Latitude = Latitude +90;
    const [auroraForecast, setAuroraForecast] = useState(0);
    const fetchAurora = useCallback(async () =>{
        try{
        
        if(city==null)
        {
            throw new Error;
        }
        const response = await axios.get(`https://services.swpc.noaa.gov/json/ovation_aurora_latest.json`);
        const auroraforecast = response.data.coordinates[Latitude+Longitude][2];
        console.log(response.data.coordinates[32580]);
        setAuroraForecast(auroraforecast);
        }
        catch(error){
            setAuroraForecast(0); 
            console.error(error);
        }
    }, [city]);

    useEffect(()=>{
        fetchAurora();
    }, [fetchAurora]);



    return(
                <div class="auroraForecast">
                    <header id="title">
                        <div id="auroraHeading">
                            <img src={star} alt='star' width='21.15' height='20.04'></img>
                            <section>Aurora Forecast</section>
                        </div>
                        <img src={helpbutton} alt='helpButton' width='25.38' height='25' id="helpButton"></img>
                    </header>
                    <section id="Forecast">
                        {auroraForecast}%
                    </section>
                    <div>
                        <img src={slider} alt='slider' id="slider"></img>
                        <img src ={pointer} alt='pointer' id="pointer" style={{left:10 + (3.2 * auroraForecast)}}></img>
                    </div>
                </div>
    )
}