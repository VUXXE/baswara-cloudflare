import React, { useState } from 'react';
import { Send } from 'lucide-react';

const RSVP = () => {
  const [attendance, setAttendance] = useState('yes');

  return (
    <section className="rsvp-section" id="rsvp">
      <div className="glass-card rsvp-card animate-fade-up">
        <h2 className="section-title">Kindly RSVP</h2>
        
        <form className="rsvp-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>Your Name</label>
            <input type="text" className="input-field" placeholder="Enter your name" />
          </div>
          
          <div className="form-group">
            <label>Attendance</label>
            <div className="radio-group">
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="attendance" 
                  value="yes" 
                  checked={attendance === 'yes'} 
                  onChange={() => setAttendance('yes')} 
                />
                <span className="radio-custom"></span>
                Yes, I'll be there
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="attendance" 
                  value="no" 
                  checked={attendance === 'no'} 
                  onChange={() => setAttendance('no')} 
                />
                <span className="radio-custom"></span>
                Sorry, can't make it
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label>Message for Aurelia</label>
            <textarea 
              className="input-field textarea-field" 
              placeholder="Write your message here..."
              rows="4"
            ></textarea>
          </div>
          
          <button type="submit" className="btn-primary w-full">
            <Send size={18} /> Send RSVP
          </button>
        </form>
      </div>
    </section>
  );
};

export default RSVP;
