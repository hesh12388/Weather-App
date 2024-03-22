import React, { useState } from 'react';
import './styles/Calendar.css'; 

// Calendar functional component receiving kpIndexData 
function Calendar({ kpIndexData }) {
  // To keep track of current date
  const [currentDate, setCurrentDate] = useState(new Date());

  // Function that allows to navigate between months
  const changeMonth = (num) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + num, 1));
  };

  // Arrays for days of the week and months
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Function to calculate the number of days in a given month and year
  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  // Function to generate the grid for the calendar
  const generateCalendarGrid = () => {
    const numDays = daysInMonth(currentDate.getMonth(), currentDate.getFullYear());
    const firstDay = firstDayOfMonth(currentDate.getMonth(), currentDate.getFullYear());
    // Creating an array of 36 elements to accommodate up to 5 week and starting empty cells
    const calendarGrid = Array.from({ length: 36 }, (_, index) => {
      const day = index >= firstDay && index < firstDay + numDays ? index - firstDay + 1 : '';
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      // Finding a matching kpIndexData item for the current date
      const kpItem = kpIndexData.find(item => item.date === dateStr);
      return { day, color: kpItem ? kpItem.color : 'transparent', kpIndex: kpItem ? kpItem.kpIndex : '' };
    });
    return calendarGrid;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        {/* Navigation buttons to move between months */}
        <button className="calendar-navigation-button" onClick={() => changeMonth(-1)}>&lt; Prev</button>
        {/* Displaying the current month and year */}
        <span>{`${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`}</span>
        <button className="calendar-navigation-button" onClick={() => changeMonth(1)}>Next &gt;</button>
      </div>
      <div className="calendar-grid">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="calendar-day-header">{day}</div>
        ))}
        {/* Generating the calendar grid cells */}
        {generateCalendarGrid().map((item, index) => (
          <div 
            key={index} 
            className={`calendar-day ${!item.day ? 'calendar-day-empty' : ''}`} 
            style={{ backgroundColor: item.color }}
          >
            <div>{item.day}</div>
            {/* Displaying the kpIndex if it exists, with brackets */}
            {item.kpIndex && <div className="kp-index">({item.kpIndex})</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;




