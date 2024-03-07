
import React from 'react';
import backgroundVid from './background.mp4';
import './Header.css';
export default function Header({CityName, Temperature, HighTemp, LowTemp, Description}){

    if(CityName==''){
        CityName=" ";
    }
    
    CityName = CityName.charAt(0).toUpperCase() + CityName.slice(1);

    Description = Description.charAt(0).toUpperCase() + Description.slice(1);
    return (
        <div class="header">
            <video autoPlay="autoplay" loop="loop" muted="muted" id="backgroundVid" src={backgroundVid} type ="video/webm"/>
            <div id="dailyTemp">
                <section id="cityname">{CityName}</section>
                <section id="temp">{Math.round(Temperature)}°</section>
                <p id="desc">{Description}</p>
                <div class="MaxMin">
                    <p id="maxmin"> H:{Math.round(HighTemp)}°</p>
                    <p id="maxmin">L:{Math.round(LowTemp)}°</p>
                </div>
            </div>
        </div>
    )

};
