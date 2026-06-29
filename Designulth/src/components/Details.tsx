import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Shirt } from 'lucide-react';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 23, hours: 12, minutes: 20, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
            else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown-container">
      <p className="countdown-title">Countdown</p>
      <div className="countdown-grid">
        <div className="countdown-item">
          <span className="countdown-number">{timeLeft.days}</span>
          <span className="countdown-label">Days</span>
        </div>
        <div className="countdown-divider"><span>|</span><span>♡</span><span>|</span></div>
        <div className="countdown-item">
          <span className="countdown-number">{timeLeft.hours}</span>
          <span className="countdown-label">Hours</span>
        </div>
        <div className="countdown-divider"><span>|</span><span>♡</span><span>|</span></div>
        <div className="countdown-item">
          <span className="countdown-number">{timeLeft.minutes}</span>
          <span className="countdown-label">Minutes</span>
        </div>
        <div className="countdown-divider"><span>|</span><span>♡</span><span>|</span></div>
        <div className="countdown-item">
          <span className="countdown-number">{timeLeft.seconds}</span>
          <span className="countdown-label">Seconds</span>
        </div>
      </div>
    </div>
  );
};

const Details = () => {
  return (
    <section className="details-section">
      <div className="glass-card details-card animate-fade-up">
        <h2 className="greeting-title">Hello,</h2>
        <h3 className="invitation-text">You're Invited<br/>to<br/>Aurelia's<br/>Birthday Celebration</h3>
        
        <div className="date-block">
          <div className="icon-wrapper"><Calendar size={24} className="icon" /></div>
          <div className="text-wrapper">
            <p className="fw-600">Saturday</p>
            <p>21 November 2026</p>
          </div>
        </div>

        <CountdownTimer />
        
        <div className="info-list">
          <div className="info-item">
            <div className="icon-wrapper"><MapPin size={24} className="icon" /></div>
            <div className="text-wrapper">
              <p className="info-label">Location</p>
              <p>Cafe Bloom<br/>Jl. Mawar No. 10<br/>Jakarta Selatan</p>
            </div>
          </div>
          
          <div className="info-item">
            <div className="icon-wrapper"><Clock size={24} className="icon" /></div>
            <div className="text-wrapper">
              <p className="info-label">Time</p>
              <p>18.30 WIB<br/>until end</p>
            </div>
          </div>
          
          <div className="info-item">
            <div className="icon-wrapper"><Shirt size={24} className="icon" /></div>
            <div className="text-wrapper">
              <p className="info-label">Dresscode</p>
              <p>White & Beige</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Details;
