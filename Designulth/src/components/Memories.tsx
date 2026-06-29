import React from 'react';
import { Grid } from 'lucide-react';

const Memories = () => {
  return (
    <section className="memories-section">
      <div className="glass-card memories-card animate-fade-up">
        <h2 className="section-title">Memories</h2>
        
        <div className="memories-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="memory-item">
              <img src="/images/hero.png" alt={`Memory ${i}`} loading="lazy" />
            </div>
          ))}
        </div>
        
        <button className="btn-secondary w-full outline-btn mt-4">
          <Grid size={18} /> See More Memories
        </button>
      </div>
    </section>
  );
};

export default Memories;
