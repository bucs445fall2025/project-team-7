import { useNavigate } from 'react-router-dom';
import './Mainpage.css';
import { useState } from 'react';

export default function Main() {
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const navigate = useNavigate();
const addCategory = () => {
  const newCategory = {
    id: Date.now(),
    name: `Category ${categories.length + 1}`,
    infoBoxes: []
  };
  setCategories([...categories, newCategory]);
};

const addInfoBox = (categoryId) => {
  setCategories(categories.map(cat => {
    if (cat.id === categoryId) {
      return {
        ...cat,
        infoBoxes: [...cat.infoBoxes, {
          id: Date.now(),
          label: 'Info Item',
          description: 'Desc...'
        }]
      };
    }
    return cat;
  }));
};

const updateInfoBoxLabel = (categoryId, infoBoxId, newLabel) => {
  setCategories(categories.map(cat => {
    if (cat.id === categoryId) {
      return {
        ...cat,
        infoBoxes: cat.infoBoxes.map(box => 
          box.id === infoBoxId ? { ...box, label: newLabel } : box
        )
      };
    }
    return cat;
  }));
};

const updateInfoBoxDescription = (categoryId, infoBoxId, newDescription) => {
  setCategories(categories.map(cat => {
    if (cat.id === categoryId) {
      return {
        ...cat,
        infoBoxes: cat.infoBoxes.map(box => 
          box.id === infoBoxId ? { ...box, description: newDescription } : box
        )
      };
    }
    return cat;
  }));
};

const deleteInfoBox = (categoryId, infoBoxId) => {
  setCategories(categories.map(cat => {
    if (cat.id === categoryId) {
      return {
        ...cat,
        infoBoxes: cat.infoBoxes.filter(box => box.id !== infoBoxId)
      };
    }
    return cat;
  }));
};

const deleteCategory = (categoryId) => {
  setCategories(categories.filter(cat => cat.id !== categoryId));
  const newExpanded = { ...expandedCategories };
  delete newExpanded[categoryId];
  setExpandedCategories(newExpanded);
};

const updateCategoryName = (categoryId, newName) => {
  setCategories(categories.map(cat => 
    cat.id === categoryId ? { ...cat, name: newName } : cat
  ));
};

const toggleCategory = (categoryId) => {
  setExpandedCategories({
    ...expandedCategories,
    [categoryId]: !expandedCategories[categoryId]
  });
};

return (
  <div className="container">
    <header className="header">
      <div className="header-content">
        <h1 className="h1">Lending Info</h1>
        <button
          onClick={addCategory}
          className="addcategory"
          title="Add Category">Add Category
        </button>
         <button
           onClick={() => navigate('/form')}
          className="addcategory"
          title="Request">Request
        </button>
         <button
         onClick={() => navigate('/chat')}
          className="addcategory"
          title="Chat"> Chat
        </button>
      </div>
    </header>

    <main className="main-content">
      {categories.length === 0 ? (
        <div className="empty-state">
          <p className="empty-text">No categories yet!</p>
        </div>
      ) : (
        <div className="categories-list">
          {categories.map(category => (
            <div key={category.id} className="category-card">
              <div className="category-header">
                <div className="category-header-left">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="toggle-btn"
                  >
                    {expandedCategories[category.id] ? '▲' : '▼'}
                  </button>
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) => updateCategoryName(category.id, e.target.value)}
                    className="category-name-input"
                  />
                  <span className="item-count">({category.infoBoxes.length} items)</span>
                </div>
                <div className="category-actions">
                  <button
                    onClick={() => addInfoBox(category.id)}
                    className="add-item-btn"
                  >
                    + Add Item
                  </button>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="delete-category-btn"
                    title="Delete Category"
                  >
                  Delete
                  </button>
                </div>
              </div>
              {expandedCategories[category.id] && (
                <div className="category-content">
                  {category.infoBoxes.length === 0 ? (
                    <p className="no-items-text">No items yet!</p>
                  ) : (
                    category.infoBoxes.map(box => (
                      <div key={box.id} className="info-box">
                        <div className="info-box-header">
                          <input
                            type="text"
                            value={box.label}
                            onChange={(e) => updateInfoBoxLabel(category.id, box.id, e.target.value)}
                            className="info-box-label"
                            placeholder="Item title"
                          />
                          <button
                            onClick={() => deleteInfoBox(category.id, box.id)}
                            className="delete-item-btn"
                            title="Delete"
                          >
                            Delete
                          </button>
                        </div>
                        <textarea
                          value={box.description}
                          onChange={(e) => updateInfoBoxDescription(category.id, box.id, e.target.value)}
                          className="info-box-description"
                          placeholder="Desc..."
                          rows="3"
                        />
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  </div>
)
}