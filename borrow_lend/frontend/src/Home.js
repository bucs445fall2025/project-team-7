import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <div className="hero-section">
          <h1 className="hero-title">
            <span className="gradient-text">Borrow & Lend</span>
          </h1>
          <p className="hero-subtitle">
            Share and borrow items with your campus community
          </p>
          <p className="hero-description">
            Browse categories, create requests, and connect with others to share resources.
          </p>
          <div className="cta-buttons">
            <Link to="/login?register=true" className="cta-button primary">
              Get Started
            </Link>
            <Link to="/login" className="cta-button secondary">
              Sign In
            </Link>
          </div>
        </div>

        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon">📂</div>
            <h3>Browse Categories</h3>
            <p>Find items by category</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Create Requests</h3>
            <p>Request what you need</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Chat & Connect</h3>
            <p>Talk directly with others</p>
          </div>
        </div>
      </div>
    </div>
  );
}
