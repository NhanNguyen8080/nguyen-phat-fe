import React from 'react';
import './WhyChooseUs.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const WhyChooseUs = () => {
  const panelRef = useScrollReveal({ threshold: 0.1 });

  return (
    <section className="why-choose-us">
      <div className="container">
        <div className="wcu-panel" ref={panelRef}>
          <div className="wcu-header reveal">
            <h2 className="section-title">Why choose <span className="text-yellow">C&amp;A?</span></h2>
            <p className="wcu-subtitle">
              Our organization boasts a vibrant team of over 1,500 dedicated experts, each bringing unique talents and perspectives. Together, we aim to deliver exceptional solutions tailored to our clients' diverse needs.
            </p>
          </div>

          <div className="wcu-features">
            <div className="wcu-feature reveal delay-2">
              <div className="feature-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent-yellow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h4 className="feature-title">Dynamic Team of Engineers</h4>
              <p className="feature-desc">
                Choosing our construction company means partnering with a dynamic team of over 1,500 skilled professionals, each contributing their own expertise and innovative ideas to every project.
              </p>
            </div>

            <div className="wcu-feature reveal delay-3">
              <div className="feature-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent-yellow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="18" rx="1" />
                  <rect x="14" y="8" width="7" height="13" rx="1" />
                  <path d="M6 7h1" />
                  <path d="M6 11h1" />
                  <path d="M6 15h1" />
                  <path d="M17 12h1" />
                  <path d="M17 16h1" />
                </svg>
              </div>
              <h4 className="feature-title">Top Quality Buildings</h4>
              <p className="feature-desc">
                When you select our construction company, you gain access to a vibrant workforce of more than 1,500 dedicated specialists, all of whom bring diverse skills and insights to the table.
              </p>
            </div>

            <div className="wcu-feature reveal delay-4">
              <div className="feature-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent-yellow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  <path d="m3 21 7-7" />
                  <path d="m13 3 8 8" />
                </svg>
              </div>
              <h4 className="feature-title">Best Tools On the Market</h4>
              <p className="feature-desc">
                Opting for our construction company means collaborating with a passionate team of over 1,500 committed experts, each offering unique abilities and perspectives that enhance our projects.
              </p>
            </div>
          </div>

          <div className="wcu-footer reveal delay-5">
            <button type="button" className="btn-primary">Start A Project</button>
            <span className="wcu-footer-text">We are the leading company in the market, providing top-notch services.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
