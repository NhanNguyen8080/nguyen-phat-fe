import React, { useLayoutEffect, useRef, useState } from 'react';
import './Services.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const services = [
  {
    id: 1,
    title: 'Commercial Construction',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Custom Building',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Outdoor Design',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 4,
    title: 'Interior Remodeling',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 5,
    title: 'Roofing Services',
    image: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 6,
    title: 'Foundation Work',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 7,
    title: 'Electrical Systems',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 8,
    title: 'Plumbing & HVAC',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop'
  }
];

const CARD_WIDTH = 280;
const CARD_GAP = 24;
const CARD_STEP = CARD_WIDTH + CARD_GAP;
const PEEK_OFFSET = CARD_WIDTH / 2;

const peekLeftService = services[services.length - 1];
const peekRightService = services[0];

const getTrackWidth = () => {
  const totalCards = services.length + 2;
  const totalGaps = totalCards - 1;
  return totalCards * CARD_WIDTH + totalGaps * CARD_GAP;
};

const getMaxIndex = (viewportWidth) => {
  const trackWidth = getTrackWidth();
  const maxOffset = trackWidth - PEEK_OFFSET - viewportWidth;
  const maxIndex = Math.floor((maxOffset - PEEK_OFFSET) / CARD_STEP);
  return Math.max(0, maxIndex);
};

const Services = () => {
  const viewportRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const headerRef = useScrollReveal();

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateMaxIndex = () => {
      const nextMaxIndex = getMaxIndex(viewport.clientWidth);
      setMaxIndex(nextMaxIndex);
      setCurrentIndex((index) => Math.min(index, nextMaxIndex));
    };

    updateMaxIndex();

    const resizeObserver = new ResizeObserver(updateMaxIndex);
    resizeObserver.observe(viewport);

    return () => resizeObserver.disconnect();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((index) => Math.max(0, index - 1));
  };

  const handleNext = () => {
    setCurrentIndex((index) => Math.min(maxIndex, index + 1));
  };

  const trackOffset = PEEK_OFFSET + currentIndex * CARD_STEP;

  return (
    <section className="services" id="product">
      <span id="services"></span>
      <div className="container">
        <div className="services-header" ref={headerRef}>
          <h2 className="section-title reveal delay-1"><span className="text-yellow">Product</span></h2>
          <p className="services-subtitle reveal delay-3">
            Our organization boasts a vibrant team of over 1,500 dedicated experts, each bringing unique talents and perspectives. Together, we aim to deliver exceptional solutions tailored to our clients' diverse needs.
          </p>
        </div>
      </div>

      <div className="services-slider">
        <button
          type="button"
          className="services-slider-btn services-slider-btn-prev"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          aria-label="Previous service"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="services-slider-viewport" ref={viewportRef}>
          <div
            className="services-slider-track"
            style={{ transform: `translateX(-${trackOffset}px)` }}
          >
            <div className="service-card card-offset service-card-peek">
              <img src={peekLeftService.image} alt={peekLeftService.title} className="service-image" />
              <div className="service-title-container">
                <h4 className="service-title">{peekLeftService.title}</h4>
              </div>
            </div>

            {services.map((service, index) => (
              <div
                key={service.id}
                className={`service-card ${index % 2 !== 0 ? 'card-offset' : ''}`}
              >
                <img src={service.image} alt={service.title} className="service-image" />
                <div className="service-title-container">
                  <h4 className="service-title">{service.title}</h4>
                </div>
              </div>
            ))}

            <div className="service-card service-card-peek">
              <img src={peekRightService.image} alt={peekRightService.title} className="service-image" />
              <div className="service-title-container">
                <h4 className="service-title">{peekRightService.title}</h4>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="services-slider-btn services-slider-btn-next"
          onClick={handleNext}
          disabled={currentIndex === maxIndex}
          aria-label="Next service"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Services;
