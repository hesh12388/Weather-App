

import React from 'react';
import {Link} from 'react-router-dom';

import homeButton from './Home.png';
import plannerButton from './CostPlanner.png';
import forecastButton from './longForecast.png';
import './Nav.css';
export default function Nav(){

    return(
    <nav class="nav-bar">
       
        <Link to="/costPlanner">
            <figure>
                <img src={plannerButton} alt="plannerButton" id="figure1" />
            </figure>
        </Link>

        <Link to="/">
            <figure>
                <img src={homeButton} alt="HomeButton" />
            </figure>
        </Link>

        <Link to="/longForecast">
            <figure>
                <img src={forecastButton} alt="forecastButton" id="figure2"/>
            </figure>
        </Link>
    </nav>
    );
};