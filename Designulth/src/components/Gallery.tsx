import React from 'react';

const Gallery = () => {
  return (
    <section className="gallery-section">
      <div className="gallery-header animate-fade-up">
        <h2 className="section-title">A Little Gallery</h2>
      </div>
      
      <div className="carousel-container animate-fade-in">
        <div className="carousel-track">
          <div className="carousel-slide active"><img src="/images/hero.png" alt="Gallery 1" /></div>
          <div className="carousel-slide"><img src="/images/hero.png" alt="Gallery 2" /></div>
          <div className="carousel-slide"><img src="/images/hero.png" alt="Gallery 3" /></div>
        </div>
        <div className="carousel-indicators">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
