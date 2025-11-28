import { useNavigate } from 'react-router-dom';
import './Mainpage.css';
import { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function Main() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Get auth token from sessionStorage
  const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  // Get user info
  useEffect(() => {
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
  }, []);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/categories`, {
          headers: getAuthHeaders()
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else if (response.status === 401) {
          // Not authenticated, redirect to login
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [navigate]);


  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="h1">Borrow & Lend</h1>
          </div>
          <div className="header-right">
            <button
              onClick={() => navigate('/my-requests')}
              className="header-btn"
              title="My Requests"
            >
              My Requests
            </button>
            <button
              onClick={() => navigate('/form')}
              className="header-btn"
              title="Request Item"
            >
              Request
            </button>
            <button
              onClick={() => navigate('/chat')}
              className="header-btn"
              title="Chat"
            >
              Chat
            </button>
            <div className="profile-menu">
              <button
                onClick={handleProfileClick}
                className="profile-btn"
                title="Profile"
              >
                <span className="profile-icon">👤</span>
                <span className="profile-name">{user?.name || 'User'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="categories-section">
          <h2 className="section-title">Browse Categories</h2>
          <p className="section-subtitle">Select a category to view or add items</p>
          
          {loading ? (
            <div className="loading-state">
              <p className="loading-text">Loading categories...</p>
            </div>
          ) : (
            <div className="categories-grid">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="category-tile"
                    onClick={() => navigate(`/category/${category.id}`)}
                  >
                    <div className="category-icon">{category.icon || '📦'}</div>
                    <h3 className="category-tile-name">{category.name}</h3>
                    <p className="category-tile-description">{category.description}</p>
                    {category._count && (
                      <span className="category-item-count">
                        {category._count.borrowRequests} requests
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="loading-state">
                  <p>No categories found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
