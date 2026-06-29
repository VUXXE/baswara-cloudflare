import { useEffect } from 'react';

export const useScrollAnimation = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    });

    // We add a slight delay to ensure DOM is ready
    const initObserver = () => {
      const hiddenElements = document.querySelectorAll('.animate-fade-up, .animate-fade-in, .animate-scale-up');
      hiddenElements.forEach((el) => observer.observe(el));
    };

    setTimeout(initObserver, 100);

    return () => observer.disconnect();
  }, []);
};
