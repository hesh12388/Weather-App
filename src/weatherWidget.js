import React from 'react';
import slider from './images/slider.png';
import pointer from './images/Ellipse.png';
import './styles/weatherWidget.css';
export default function WeatherWidget({Icon, Heading, Value,Description, Percentage}){

// capping the percentage at 89 in order to make slider work properly
if(Percentage>80){
    Percentage = 79;
}

// this css style is to move the pointer on the slider
// to the correct position based on the percentage passed in as a prop
const customStyles = {
    right: `${80 - Percentage}%`,
}
return (
    <div class="widget">
        <div class="widgetHeading">
            <img src={Icon} alt="widget icon" id="icon"/>
            <section id="widget-title">{Heading}</section>
        </div>
        <div class="valueSection">
            {Value}
        </div>

        <section id="description">
            {Description}
        </section>

        <div>
            <img src={slider} alt='slider' id="slider2"></img>
            <img src ={pointer} alt='pointer' id="pointer2" style={customStyles}></img>
        </div>
    
    </div>
)

}