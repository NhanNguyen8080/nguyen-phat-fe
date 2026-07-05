import React from 'react';
import './Contact.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const Contact = () => {
  const panelRef = useScrollReveal({ threshold: 0.08 });

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact-panel" ref={panelRef}>
          <div className="contact-header reveal">
            <h2 className="section-title">
              Contact <span className="text-yellow">Us</span>
            </h2>
            <p className="contact-subtitle">
              Ready to start your next project? Get in touch with our team and we will help you build something exceptional.
            </p>
          </div>

          <div className="contact-content">
            <div className="contact-info reveal-left delay-2">
              <div className="contact-info-item">
                <h4 className="contact-info-title">Email</h4>
                <p className="contact-info-text">hello@canda.com</p>
              </div>
              <div className="contact-info-item">
                <h4 className="contact-info-title">Phone</h4>
                <p className="contact-info-text">+1 (555) 123-4567</p>
              </div>
              <div className="contact-info-item">
                <h4 className="contact-info-title">Office</h4>
                <p className="contact-info-text">
                  123 Construction Ave,
                  <br />
                  Silicon Valley, CA 94025
                </p>
              </div>
            </div>

            <form className="contact-form reveal-right delay-3" onSubmit={(e) => e.preventDefault()}>
              <div className="contact-form-row">
                <input type="text" className="contact-input" placeholder="Your Name" />
                <input type="email" className="contact-input" placeholder="Your Email" />
              </div>
              <textarea
                className="contact-input contact-textarea"
                placeholder="Tell us about your project"
                rows={5}
              />
              <button type="submit" className="btn-primary contact-submit">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
