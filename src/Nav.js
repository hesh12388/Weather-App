

import React from 'react';
import {Link} from 'react-router-dom';

import homeButton from './images/Home.png';
import plannerButton from './images/CostPlanner.png';
import forecastButton from './images/longForecast.png';
import './styles/Nav.css';
export default function Nav(){
    // Used Link components to navigate to different routes/pages when clicked
    return(
    <nav class="nav-bar">
        {/* The to variable specifies which path to navigate to. It adds this path to the root path */}
        {/* This navigates to planning page */}
        <Link to="/costPlanner">
            <figure>
                <img src={plannerButton} alt="plannerButton" id="figure1" />
            </figure>
        </Link>
        {/* This navigates to home page */}
        <Link to="/">
            <figure>
                <img src={homeButton} alt="HomeButton" id="figure3"/>
            </figure>
        </Link>
        {/* This navigates to long forecast of Kp indexes page */}
        <Link to="/longForecast">
            <figure>
                <img src={forecastButton} alt="forecastButton" id="figure2"/>
            </figure>
        </Link>
    </nav>
    );
};