
import React from 'react';
import './styles/Header.css';
import AnimatedPage from './AnimatedPage';
export default function Header({CityName, Temperature, HighTemp, LowTemp, Description}){
    
 
    // convert the city name to uppercase
    CityName = CityName.charAt(0).toUpperCase() + CityName.slice(1);
    //convert description to uppercase
    Description = Description.charAt(0).toUpperCase() + Description.slice(1);
    return (

        
             <div class="Weather-header">
           
            <AnimatedPage>
        
                <div id="dailyTemp">
                    <section id="cityname">{CityName}</section>
                    <section id="temp">{Math.round(Temperature)}°</section>
                    <p id="desc">{Description}</p>
                    <div class="MaxMin">
                        <p id="maxmin"> H:{Math.round(HighTemp)}°</p>
                        <p id="maxmin">L:{Math.round(LowTemp)}°</p>
                    </div>
                </div>
                
            </AnimatedPage>
                
             </div>
        
       
    )

};
