import { useState } from 'react';
import { Link } from 'react-router-dom';

function Main() {
  const [user, setUser] = useState(() => {
    const userData = sessionStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '20px 0',
        borderBottom: '2px solid #ddd',
        marginBottom: '40px'
      }}>
        <h1>Welcome to Main Page</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {user && <span>Hello, {user.name || user.email}!</span>}
          {user ? (
            <button 
              onClick={handleLogout}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          ) : (
            <Link to="/">
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>
                Login
              </button>
            </Link>
          )}
        </div>
      </header>

      <main>
        <section style={{ marginBottom: '40px' }}>
          <h2>Dashboard</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginTop: '20px'
          }}>
            <div style={{
              padding: '30px',
              backgroundColor: '#f8f9fa',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3>Profile</h3>
              <p>Manage your account settings</p>
            </div>
            <div style={{
              padding: '30px',
              backgroundColor: '#f8f9fa',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3>Projects</h3>
              <p>View and manage your projects</p>
            </div>
            <div style={{
              padding: '30px',
              backgroundColor: '#f8f9fa',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3>Settings</h3>
              <p>Configure your preferences</p>
            </div>
          </div>
        </section>

        <section>
          <h2>Recent Activity</h2>
          <div style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px'
          }}>
            <p>No recent activity to display.</p>
          </div>
        </section>
      </main>

      <footer style={{
        marginTop: '60px',
        padding: '20px 0',
        borderTop: '2px solid #ddd',
        textAlign: 'center',
        color: '#666'
      }}>
        <p>&copy; 2025 Your App Name. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Main;