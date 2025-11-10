import { useState } from 'react';
import './requestform.css';


export default function Form () {
  const [formData, setFormData] = useState({
    label: '',
    description: '',
    category:''
  });
  const [submittedItems, setSubmittedItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const categories = ['Writing Utensils','Calculators','Notebooks','Cleaning Supplies','Miscellaneous'];
  const handleSubmit = () => {
    if (!formData.label.trim()) {
      alert('Please enter a label');
      return;
    }
    if (editingId !== null) {
      setSubmittedItems(submittedItems.map(item =>
        item.id === editingId
          ? { ...item, label: formData.label, description: formData.description }
          : item
      ));
      setEditingId(null);
    } else {
      const newItem = {
        id: Date.now(),
        label: formData.label,
        description: formData.description
      };
      setSubmittedItems([...submittedItems, newItem]);
    }

    setFormData({ label: '', description: '' });
  };

  const handleEdit = (item) => {
    setFormData({ label: item.label, description: item.description });
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    setSubmittedItems(submittedItems.filter(item => item.id !== id));
    if (editingId === id) {
      setFormData({ label: '', description: '' });
      setEditingId(null);
    }
  };

  const handleCancel = () => {
    setFormData({ label: '', description: '' });
    setEditingId(null);
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header-content">
          <h1 className="h1">Info Item </h1>     
          <div className="main-content">
            <div>
              <label className="h1">
                Item Label
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Enter item title"
                className="info-box-label"
              />
            </div>




             <div>
              <label className="h1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="info-box-label"
              >
                <option value="">Select a category...</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>


            

            <div>
              <label className="h1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description..."
                rows="4"
                className="info-box-label"
              />
            </div>

            <div className="">
              <button
                onClick={handleSubmit}
                className=""
              >
                {editingId !== null ? 'Update Item' : 'Add Item'}
              </button>
              {editingId !== null && (
                <button
                  onClick={handleCancel}
                  className=""
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="category-card">
          <h2 className="h1">
            Submitted Items ({submittedItems.length})
          </h2>
          
          {submittedItems.length === 0 ? (
            <div className="h1">
              <p className="h1">No items</p>
            </div>
          ) : (
            submittedItems.map(item => (
              <div key={item.id} className="">
                <div className="">
                  <h3 className="">{item.label}</h3>
                  <div className="">
                    <button
                      onClick={() => handleEdit(item)}
                      className=""
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className=""
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {item.description && (
                  <p className="">{item.description}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}