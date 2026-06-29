import React from 'react';
import { Gift, ChevronDown } from 'lucide-react';

const Hero = () => {
  return (
    <section className="hero-section" id="hero">
      <div className="hero-content animate-fade-up">
        <p className="hero-subtitle">LET'S CELEBRATE</p>
        <h1 className="hero-title">
          Happy<br />Birthday<br />
          <span className="hero-name">Aurelia</span>
        </h1>
        <p className="hero-date">✦ 23rd Birthday ✦</p>
        
        <div className="hero-image-container">
          <img src="/images/hero.png" alt="Aurelia" className="hero-image" />
        </div>
        
        <div className="hero-message">
          <h2>Dear, Hanan</h2>
          <p>You are specially invited<br/>to celebrate my special day!</p>
        </div>
        
        <a href="#rsvp" className="btn-primary open-invitation">
          <Gift size={20} /> Open Invitation
        </a>
        
        <div className="scroll-indicator">
          <p>Scroll Down</p>
          <ChevronDown className="scroll-icon" size={24} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
