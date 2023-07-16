import "../styles/bookings.css";
import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Tab } from '@mui/material';
import Typewriter from "typewriter-effect/dist/core";
import Contacts from "./contacts";

const Bookings = () => {
  const [value, setValue] = useState('one');
  const typewriterRef = useRef(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    // Initialize the Typewriter effect
    const typewriter = new Typewriter(typewriterRef.current, {
      strings: ["YOUR RIDES..."],
      autoStart: true,
      loop: true,
      typeSpeed: 10,
    });

    return () => {
      // Clean up the Typewriter effect
      typewriter.stop();
    };
  }, []);

  const renderContent = () => {
    if (value === 'one') {
      return <Contacts/>;
    }
    if (value === 'two') {
      return <Contacts/>;
    }
    if (value === 'three') {
      return <Contacts/>;
    }  
  };

  return (
    <div className="bookings">
      <div className="booking__wrapper">
        <h2 className="booking__title" ref={typewriterRef}>YOUR RIDES...</h2>
      </div>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
      >
        <Tab value="one" label="PAST" sx={{ fontSize: '1.2rem' }}/>
        <Tab value="two" label="UPCOMING" sx={{ fontSize: '1.2rem' }}/>
        <Tab value="three" label="CANCELLED" sx={{ fontSize: '1.2rem' }}/>
      </Tabs>
      {renderContent()}
    </div>
  );
};

export default Bookings;
