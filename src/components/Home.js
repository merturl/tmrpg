import React, { Component } from 'react';

import { home } from './home.scss';
import Contents from "./Contents";

class Home extends Component {
  render() {
    return (
      <div>
        <div className={home}>
          React
        </div>
        <svg width="50" height="50" viewBox="0 0 100 100">
          <g className="cicle">
            <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="4" fill="white" />
          </g>
          <g className="horizontal-lines">
            <line x1="30" x2="70" y1="20" y2="20" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
            <line x1="25" x2="75" y1="30" y2="30" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
            <line x1="20" x2="80" y1="40" y2="40" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
            <line x1="20" x2="80" y1="50" y2="50" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
            <line x1="20" x2="80" y1="60" y2="60" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
            <line x1="25" x2="75" y1="70" y2="70" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
            <line x1="30" x2="70" y1="80" y2="80" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
          </g>
          <g className="vertical-lines">
            <line y1="30" y2="70" x1="20" x2="20" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
            <line y1="25" y2="75" x1="30" x2="30" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
            <line y1="20" y2="80" x1="40" x2="40" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
            <line y1="20" y2="80" x1="50" x2="50" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
            <line y1="20" y2="80" x1="60" x2="60" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
            <line y1="25" y2="75" x1="70" x2="70" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
            <line y1="30" y2="70" x1="80" x2="80" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
          </g>
        </svg>
        <Contents/>
      </div>
    );
  }
}


export default Home;
