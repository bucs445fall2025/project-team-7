import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { useState, useEffect, useCallback } from 'react';
=======
import { useState, useEffect } from 'react';
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
import './MyRequests.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function MyRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    message: '',
    startDate: '',
    endDate: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

<<<<<<< HEAD
  const fetchRequests = useCallback(async () => {
=======
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
    try {
      const response = await fetch(`${API_URL}/api/requests/mine`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else if (response.status === 401) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
<<<<<<< HEAD
  }, [navigate]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);
=======
  };
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c

  const handleEdit = (request) => {
    setEditingId(request.id);
    setFormData({
      title: request.title,
      description: request.description || '',
      message: request.message || '',
      startDate: request.startDate ? new Date(request.startDate).toISOString().split('T')[0] : '',
      endDate: request.endDate ? new Date(request.endDate).toISOString().split('T')[0] : ''
    });
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      message: '',
      startDate: '',
      endDate: ''
    });
    setError('');
    setSuccess('');
  };

  const handleSave = async (requestId) => {
    setError('');
    setSuccess('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    // Validate dates
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start > end) {
        setError('Start date cannot be after end date');
        return;
      }
    }

    try {
      const updateData = {
        title: formData.title.trim(),
        description: formData.description || '',
        message: formData.message || '',
        startDate: formData.startDate || null,
        endDate: formData.endDate || null
      };

      const response = await fetch(`${API_URL}/api/requests/${requestId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        setSuccess('Request updated successfully!');
        setEditingId(null);
        fetchRequests();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update request');
      }
    } catch (error) {
      console.error('Error updating request:', error);
      setError('Failed to update request. Please try again.');
    }
  };

  const handleDelete = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/requests/${requestId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok || response.status === 204) {
        setSuccess('Request deleted successfully!');
        fetchRequests();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete request');
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      setError('Failed to delete request. Please try again.');
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      const response = await fetch(`${API_URL}/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ action: 'cancel' })
      });

      if (response.ok) {
        setSuccess('Request canceled successfully!');
        fetchRequests();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to cancel request');
      }
    } catch (error) {
      console.error('Error canceling request:', error);
      setError('Failed to cancel request. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="my-requests-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="my-requests-container">
      <header className="my-requests-header">
        <button onClick={() => navigate('/main')} className="back-btn">
          ← Back
        </button>
        <h1>My Requests</h1>
        <button onClick={() => navigate('/form')} className="create-btn">
          + Create Request
        </button>
      </header>

      <main className="my-requests-content">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {requests.length === 0 ? (
          <div className="no-requests">
            <p>You haven't created any requests yet.</p>
            <button onClick={() => navigate('/form')} className="create-first-btn">
              Create Your First Request
            </button>
          </div>
        ) : (
          <div className="requests-list">
            {requests.map((request) => (
              <div key={request.id} className="request-item">
                {editingId === request.id ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label>Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="form-input"
                        rows="3"
                      />
                    </div>
                    <div className="form-group">
                      <label>Message</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="form-input"
                        rows="2"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Start Date</label>
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => {
                            const newStartDate = e.target.value;
                            setFormData({ ...formData, startDate: newStartDate });
                            // Validate immediately if end date exists
                            if (newStartDate && formData.endDate && new Date(newStartDate) > new Date(formData.endDate)) {
                              setError('Start date cannot be after end date');
                            } else if (error === 'Start date cannot be after end date') {
                              setError('');
                            }
                          }}
                          max={formData.endDate || undefined}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>End Date</label>
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => {
                            const newEndDate = e.target.value;
                            setFormData({ ...formData, endDate: newEndDate });
                            // Validate immediately if start date exists
                            if (formData.startDate && newEndDate && new Date(formData.startDate) > new Date(newEndDate)) {
                              setError('Start date cannot be after end date');
                            } else if (error === 'Start date cannot be after end date') {
                              setError('');
                            }
                          }}
                          min={formData.startDate || undefined}
                          className="form-input"
                        />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button onClick={() => handleSave(request.id)} className="save-btn">
                        Save
                      </button>
                      <button onClick={handleCancel} className="cancel-btn">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="request-header">
                      <div className="request-title-section">
                        <h3>{request.title}</h3>
                        <span className={`status-badge status-${request.status.toLowerCase()}`}>
                          {request.status}
                        </span>
                      </div>
                      {request.category && (
                        <div className="request-category">
                          <span>{request.category.icon}</span>
                          <span>{request.category.name}</span>
                        </div>
                      )}
                    </div>

                    {request.description && (
                      <p className="request-description">{request.description}</p>
                    )}

                    {request.message && (
                      <p className="request-message">Message: {request.message}</p>
                    )}

                    {(request.startDate || request.endDate) && (
                      <div className="request-dates">
                        {request.startDate && (
                          <span>From: {new Date(request.startDate).toLocaleDateString()}</span>
                        )}
                        {request.endDate && (
                          <span>To: {new Date(request.endDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    )}

                    <div className="request-footer">
                      <span className="request-date">
                        Created: {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                      <div className="request-actions">
                        {request.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleEdit(request)}
                              className="edit-btn"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleCancelRequest(request.id)}
                              className="cancel-request-btn"
                            >
                              Cancel Request
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(request.id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                        {request.category && (
                          <button
                            onClick={() => navigate(`/category/${request.category.id}`)}
                            className="view-category-btn"
                          >
                            View Category
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

