import "../styles/sell-car.css";
import React, { useEffect, useRef } from 'react';
import Typewriter from "typewriter-effect/dist/core";
import Vehicles from "./vehicles";

const SellCar = () => {
  const typewriterRef = useRef(null);
 
  useEffect(() => {
    // Initialize the Typewriter effect
    const typewriter = new Typewriter(typewriterRef.current, {
      strings: ["YOUR VEHICLES..."],
      autoStart: true,
      loop: true,
      typeSpeed: 10,
    });

    return () => {
      // Clean up the Typewriter effect
      typewriter.stop();
    };
  }, []);

  return (
    <div className="bookings">
      <div className="booking__wrapper">
        <h2 className="booking__title" ref={typewriterRef}>YOUR VEHICLES...</h2>
      </div>
      <Vehicles/>
    </div>
  );
};

export default SellCar;
