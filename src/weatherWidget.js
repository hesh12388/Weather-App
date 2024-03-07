import React from 'react';
import slider from './slider.png';
import pointer from './Ellipse.png';
import './weatherWidget.css';
export default function WeatherWidget({Icon, Heading, Value,Description, Percentage}){
return (
    <div class="widget">
        <div class="widgetHeading">
            <img src={Icon} alt="widget icon" />
            <section>{Heading}</section>
        </div>
        <div class="valueSection">
            {Value}
        </div>

        <section id="description">
            {Description}
        </section>

        <div>
            <img src={slider} alt='slider' id="slider2"></img>
            <img src ={pointer} alt='pointer' id="pointer2" style={{left:10 + (148.439 * Percentage/100)}}></img>
        </div>
    
    </div>
)

}