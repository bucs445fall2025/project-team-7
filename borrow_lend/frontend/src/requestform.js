import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './requestform.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function Form() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryIdParam = searchParams.get('categoryId');
  
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: categoryIdParam ? parseInt(categoryIdParam) : '',
    title: '',
    description: '',
    message: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/categories`, {
          headers: getAuthHeaders()
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.categoryId) {
      setError('Please select a category');
      return;
    }
    if (!formData.title.trim()) {
      setError('Please enter a title');
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

    setLoading(true);

    try {
      const categoryIdNum = parseInt(formData.categoryId);
      if (isNaN(categoryIdNum)) {
        setError('Please select a valid category');
        return;
      }

      const requestData = {
        categoryId: categoryIdNum,
        title: formData.title.trim(),
        description: formData.description || '',
        message: formData.message || '',
        startDate: formData.startDate && formData.startDate.trim() ? formData.startDate.trim() : null,
        endDate: formData.endDate && formData.endDate.trim() ? formData.endDate.trim() : null
      };

      const response = await fetch(`${API_URL}/api/requests`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
<<<<<<< HEAD
        await response.json();
=======
        const data = await response.json();
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
        setSuccess('Request created successfully!');
        // Reset form
        setFormData({
          categoryId: categoryIdParam ? parseInt(categoryIdParam) : '',
          title: '',
          description: '',
          message: '',
          startDate: '',
          endDate: ''
        });
        // Redirect to category page after 1 second
        setTimeout(() => {
          navigate(`/category/${formData.categoryId}`);
        }, 1000);
      } else {
        let errorMessage = 'Failed to create request';
        try {
          const errorData = await response.json();
          if (errorData.error) {
            // Handle both string and object errors
            if (typeof errorData.error === 'string') {
              errorMessage = errorData.error;
            } else if (errorData.error.formErrors && errorData.error.formErrors.length > 0) {
              errorMessage = errorData.error.formErrors[0];
            } else if (errorData.error.fieldErrors) {
              const fieldErrors = Object.values(errorData.error.fieldErrors).flat();
              errorMessage = fieldErrors[0] || errorMessage;
            }
          }
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error creating request:', error);
      setError('Failed to create request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="request-form-container">
      <header className="request-form-header">
        <button onClick={() => navigate('/main')} className="back-btn">
          ← Back
        </button>
        <h1>Create Borrow Request</h1>
      </header>

      <main className="request-form-content">
        <form onSubmit={handleSubmit} className="request-form">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
              disabled={!!categoryIdParam}
              className="form-input"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">What do you want to borrow? *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Pen, Laptop, Book"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional details about what you need..."
              rows="4"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message to lenders</label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Any specific requirements or notes..."
              rows="3"
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date (optional)</label>
              <input
                id="startDate"
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
              <label htmlFor="endDate">End Date (optional)</label>
              <input
                id="endDate"
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
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Creating...' : 'Create Request'}
            </button>
            <button type="button" onClick={() => navigate('/main')} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
