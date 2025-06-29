import React, { useEffect, useRef } from 'react';
import "./Home.css";
import { FaRegChartBar, FaChartLine, FaBell, FaFileInvoiceDollar } from "react-icons/fa";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';

const statsData = [
  { value: '100K+', label: 'Users' },
  { value: '1M+', label: 'Transactions' },
  { value: '$50M', label: 'Saved' },
  { value: '200+', label: 'Partners' },
];

const featuresData = [
  { icon: <FaFileInvoiceDollar size={30} />, title: 'Track Expenses', description: 'Monitor all your spending in one place.' },
  { icon: <FaBell size={30} />, title: 'Alerts', description: 'Get notified about due bills and spending habits.' },
  { icon: <FaChartLine size={30} />, title: 'Reports', description: 'Visualize your financial health.' },
];

const howItWorksData = [
  { icon: '1️⃣', title: 'Sign Up', description: 'Create your free account.' },
  { icon: '2️⃣', title: 'Link Accounts', description: 'Securely connect your bank accounts.' },
  { icon: '3️⃣', title: 'Manage', description: 'Track and optimize your finances.' },
];

const testimonialsData = [
  { name: 'Jane Doe', role: 'Entrepreneur', quote: 'MoneyGrid helped me save $10K in a year!' },
  { name: 'John Smith', role: 'Freelancer', quote: 'Best app for money management.' },
  { name: 'Alice Brown', role: 'Student', quote: 'Simple and easy to use!' },
  { name: 'Emily Joseph', role: 'Financial Planner', quote: 'A goal without a plan is just a wish.' },
  { name: 'Ailani Adams', role: 'Private Equity Professional', quote: 'The more you learn, the more you earn.' },
  { name: 'Aisha Golden', role: 'Economist', quote: 'The hardest thing in the world to understand is the income tax.' },
  { name: 'Eva Felix', role: 'Trader', quote: 'The best way to predict the future is to create it.' },
  { name: 'George Bass', role: 'Tax Advisor', quote: "Risk comes from not knowing what you're doing" },
];

const Home = () => {
  const imageRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
  AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: false,
    mirror: true,
  });

  // Trigger refresh on scroll or resize
  window.addEventListener('scroll', AOS.refresh);
  window.addEventListener('resize', AOS.refresh);

  return () => {
    window.removeEventListener('scroll', AOS.refresh);
    window.removeEventListener('resize', AOS.refresh);
  };
}, []);


  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section" data-aos="fade-up">
        <div className="container">
          <h1 className="hero-title">Empower <br /> Your Financial <br /> Decisions with Intelligence</h1>
          <p className="hero-description">
            An AI-powered financial management platform that helps you track,
            analyze, and optimize your spending with real-time insights.
          </p>
          <div className="button-group">
            <button className="primary-button" onClick={() => navigate("/login")}>
              Get Started
            </button>
          </div>
          <div className="hero-image-wrapper" data-aos="zoom-in" data-aos-delay="300">
            <div ref={imageRef} className="hero-image">
              <img src="src/assets/banner.jpg" width="1280" height="400" alt="Dashboard Preview" className="hero-img" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section blue-bg-light" data-aos="fade-up">
        <div className="container">
          <div className="grid four-cols">
            {statsData.map((stat, index) => (
              <div
                key={index}
                className="text-center"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section" id="features" data-aos="fade-up">
        <div className="container">
          <h2 className="section-title">Everything you need to manage your finances</h2>
          <div className="grid three-cols">
            {featuresData.map((feature, index) => (
              <div
                key={index}
                className="card"
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <div className="card-content">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section blue-bg-light" data-aos="fade-up">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="grid three-cols">
            {howItWorksData.map((step, index) => (
              <div
                key={index}
                className="text-center"
                data-aos="zoom-in"
                data-aos-delay={index * 150}
              >
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section" id="testimonials" data-aos="fade-up">
        <div className="container">
          <h2 className="section-title">What Our Users Say</h2>
          <div className="grid three-cols">
            {testimonialsData.map((testimonial, index) => (
              <div
                key={index}
                className="card"
                data-aos="flip-left"
                data-aos-delay={index * 100}
              >
                <div className="card-content testimonial-card">
                  <div className="testimonial-header">
                    <div className="testimonial-info">
                      <div className="testimonial-name">{testimonial.name}</div>
                      <div className="testimonial-role">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="testimonial-quote">{testimonial.quote}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section green-bg-dark cta-section" data-aos="fade-up">
        <div className="container text-center">
          <h2 className="cta-title">Ready to Take Control of Your Finances?</h2>
          <p className="cta-subtitle">
            Join thousands of users who are already managing their finances smarter with Welth.
          </p>
          <button className="cta-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Scroll Up to Get Started
          </button>
        </div>
      </section>
      <br /><br />
    </div>
  );
};

export default Home;
