// src/components/Countdown.jsx
import React, { useState, useEffect } from 'react';

const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(targetDate) - new Date();
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex space-x-4">
      <div className="bg-gray-800 p-4 rounded">{timeLeft.days || 0} Days</div>
      <div className="bg-gray-800 p-4 rounded">{timeLeft.hours || 0} Hours</div>
      <div className="bg-gray-800 p-4 rounded">{timeLeft.minutes || 0} Minutes</div>
      <div className="bg-gray-800 p-4 rounded">{timeLeft.seconds || 0} Seconds</div>
    </div>
  );
};

export default Countdown;