import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import './Profile.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState({ name: false, email: false, password: false });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    currentPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
      }
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      console.log('Fetching user from:', `${API_URL}/api/auth/me`);
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers
      });
      console.log('Response status:', response.status);
      if (response.ok) {
        const userData = await response.json();
        console.log('User data received:', userData);
        setUser(userData);
        setFormData({
          name: userData.name,
          email: userData.email,
          password: '',
          currentPassword: ''
        });
      } else if (response.status === 401) {
        console.log('Unauthorized, redirecting to login');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/login');
      } else {
        let errorData;
        try {
          const text = await response.text();
          console.log('Error response text:', text);
          errorData = text ? JSON.parse(text) : { error: `HTTP ${response.status}` };
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        console.error('Error response:', errorData);
        setError(errorData.error || `Failed to load profile (${response.status})`);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setError(`Failed to connect to server: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUser();
  }, [navigate, fetchUser]);

  const handleEdit = (field) => {
    setEditing({ ...editing, [field]: true });
    setError('');
    setSuccess('');
  };

  const handleCancel = (field) => {
    setEditing({ ...editing, [field]: false });
    if (field === 'name') setFormData({ ...formData, name: user.name });
    if (field === 'email') setFormData({ ...formData, email: user.email });
    if (field === 'password') setFormData({ ...formData, password: '', currentPassword: '' });
    setError('');
    setSuccess('');
  };

  const handleSave = async (field) => {
    setError('');
    setSuccess('');

    try {
      const updateData = {};
      if (field === 'name') {
        if (!formData.name.trim()) {
          setError('Name cannot be empty');
          return;
        }
        updateData.name = formData.name;
      } else if (field === 'email') {
        if (!formData.email.trim()) {
          setError('Email cannot be empty');
          return;
        }
        updateData.email = formData.email;
      } else if (field === 'password') {
        if (!formData.password || formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          return;
        }
        if (!formData.currentPassword) {
          setError('Current password is required');
          return;
        }
        updateData.password = formData.password;
        updateData.currentPassword = formData.currentPassword;
      }

      const token = sessionStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        setEditing({ ...editing, [field]: false });
        setSuccess(`${field === 'name' ? 'Name' : field === 'email' ? 'Email' : 'Password'} updated successfully!`);
        if (field === 'password') {
          setFormData({ ...formData, password: '', currentPassword: '' });
        }
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update');
      }
    } catch (error) {
      console.error('Error updating:', error);
      setError('Failed to update. Please try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <header className="profile-header">
          <button onClick={() => navigate('/main')} className="back-btn">
            ← Back
          </button>
          <h1>Profile</h1>
        </header>
        <main className="profile-content">
          <div className="profile-card">
            {error ? (
              <div>
                <div className="alert alert-error">{error}</div>
                <button onClick={() => navigate('/login')} className="logout-btn">
                  Go to Login
                </button>
              </div>
            ) : (
              <div className="loading">Loading profile...</div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <header className="profile-header">
        <button onClick={() => navigate('/main')} className="back-btn">
          ← Back
        </button>
        <h1>Profile</h1>
      </header>
      <main className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <span className="avatar-icon">👤</span>
          </div>
          <h2>{user.name}</h2>
          <p className="profile-email">{user.email}</p>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="profile-edit-section">
            <div className="edit-field">
              <label>Name</label>
              {editing.name ? (
                <div className="edit-controls">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="edit-input"
                  />
                  <div className="edit-buttons">
                    <button onClick={() => handleSave('name')} className="save-btn">Save</button>
                    <button onClick={() => handleCancel('name')} className="cancel-btn">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="field-display">
                  <span>{user.name}</span>
                  <button onClick={() => handleEdit('name')} className="edit-btn">Edit</button>
                </div>
              )}
            </div>

            <div className="edit-field">
              <label>Email</label>
              {editing.email ? (
                <div className="edit-controls">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="edit-input"
                  />
                  <div className="edit-buttons">
                    <button onClick={() => handleSave('email')} className="save-btn">Save</button>
                    <button onClick={() => handleCancel('email')} className="cancel-btn">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="field-display">
                  <span>{user.email}</span>
                  <button onClick={() => handleEdit('email')} className="edit-btn">Edit</button>
                </div>
              )}
            </div>

            <div className="edit-field">
              <label>Password</label>
              {editing.password ? (
                <div className="edit-controls">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    className="edit-input"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="edit-input"
                  />
                  <div className="edit-buttons">
                    <button onClick={() => handleSave('password')} className="save-btn">Save</button>
                    <button onClick={() => handleCancel('password')} className="cancel-btn">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="field-display">
                  <span>••••••••</span>
                  <button onClick={() => handleEdit('password')} className="edit-btn">Change</button>
                </div>
              )}
            </div>
          </div>

          <div className="profile-actions">
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

