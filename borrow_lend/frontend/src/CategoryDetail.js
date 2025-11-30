import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './CategoryDetail.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function CategoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch category
        const categoryResponse = await fetch(`${API_URL}/api/categories/${id}`, {
          headers: getAuthHeaders()
        });
        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json();
          setCategory(categoryData);
        }

        // Fetch requests for this category
        const requestsResponse = await fetch(`${API_URL}/api/categories/${id}/requests`, {
          headers: getAuthHeaders()
        });
        if (requestsResponse.ok) {
          const requestsData = await requestsResponse.json();
          setRequests(requestsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleCreateRequest = () => {
    navigate(`/form?categoryId=${id}`);
  };

  const handleChat = (borrowerId, borrowerName, requestId) => {
    // Navigate to chat with the borrower
    navigate(`/chat?userId=${borrowerId}&userName=${borrowerName}&requestId=${requestId}`);
  };

  if (loading) {
    return (
      <div className="category-detail-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="category-detail-container">
        <div className="error">Category not found</div>
      </div>
    );
  }

  return (
    <div className="category-detail-container">
      <header className="category-header">
        <button onClick={() => navigate('/main')} className="back-btn">
          ← Back
        </button>
        <div className="category-header-info">
          <span className="category-header-icon">{category.icon || '📦'}</span>
          <h1>{category.name}</h1>
        </div>
        <button onClick={handleCreateRequest} className="create-request-btn">
          + Create Request
        </button>
      </header>

      <main className="category-content">
        <div className="category-description">
          <p>{category.description}</p>
        </div>

        <div className="requests-section">
          <h2>Borrow Requests ({requests.length})</h2>
          
          {requests.length === 0 ? (
            <div className="no-requests">
              <p>No requests in this category yet.</p>
              <button onClick={handleCreateRequest} className="create-first-request-btn">
                Create First Request
              </button>
            </div>
          ) : (
            <div className="requests-grid">
              {requests.map((request) => (
                <div key={request.id} className="request-card">
                  <div className="request-header">
                    <h3 className="request-title">{request.title}</h3>
                    <span className={`request-status status-${request.status.toLowerCase()}`}>
                      {request.status}
                    </span>
                  </div>
                  
                  {request.description && (
                    <p className="request-description">{request.description}</p>
                  )}
                  
                  <div className="request-details">
                    <div className="request-borrower">
                      <span className="borrower-label">Requested by:</span>
                      <span className="borrower-name">{request.borrower.name}</span>
                    </div>
                    
                    {request.message && (
                      <p className="request-message">{request.message}</p>
                    )}
                    
                    {request.startDate && (
                      <div className="request-dates">
                        <span>From: {new Date(request.startDate).toLocaleDateString()}</span>
                        {request.endDate && (
                          <span>To: {new Date(request.endDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="request-actions">
                    <button
                      onClick={() => handleChat(request.borrower.id, request.borrower.name, request.id)}
                      className="chat-btn"
                    >
                      💬 Chat
                    </button>
                    <span className="request-date">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

