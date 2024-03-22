import React from 'react';
import './styles/costPlanner.css';
import Results from './Results.js';
import CostPlannerHeader from './costPlannerHeader.js';
import Nav from './Nav.js';
function CostPlanner() 
{
  return <div id="mainDiv">
  <CostPlannerHeader />
  <Results />
  <Nav id="costNav"/>
  </div>
}

export default CostPlanner;