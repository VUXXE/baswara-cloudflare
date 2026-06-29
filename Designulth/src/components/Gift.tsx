import React, { useState } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';

const Gift = () => {
  const [copied, setCopied] = useState(false);
  const accountNumber = "1234567890";

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="gift-section">
      <div className="glass-card gift-card animate-fade-up">
        <h2 className="section-title">Birthday Gift</h2>
        
        <p className="gift-message">
          Your love and presence are the best gift for me.<br/>
          But if you'd like to send a gift,<br/>
          you can use the details below.<br/>
          Thank you!
        </p>
        
        <div className="gift-image-container">
          <img src="/images/gift.png" alt="Gift Box" className="gift-image" />
        </div>
        
        <div className="bank-details">
          <h3 className="bank-name">BCA</h3>
          <p className="account-number">{accountNumber}</p>
          <p className="account-name">AURELIA</p>
          
          <button 
            className={`btn-secondary copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
          >
            {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy Number'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Gift;
