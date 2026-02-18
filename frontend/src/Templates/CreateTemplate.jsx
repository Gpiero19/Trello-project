import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createTemplate } from "../api/templates";
import { useAuth } from "../context/authContext";
import { useToast } from "../context/ToastContext";
import "./createTemplate.css";

function CreateTemplate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [lists, setLists] = useState([]);
  const [saving, setSaving] = useState(false);

  const addList = () => {
    setLists([
      ...lists,
      { id: Date.now(), title: "", cards: [] }
    ]);
  };

  const removeList = (listId) => {
    setLists(lists.filter((l) => l.id !== listId));
  };

  const updateListTitle = (listId, title) => {
    setLists(
      lists.map((l) => (l.id === listId ? { ...l, title } : l))
    );
  };

  const addCard = (listId) => {
    setLists(
      lists.map((l) =>
        l.id === listId
          ? { ...l, cards: [...l.cards, { id: Date.now(), title: "", description: "" }] }
          : l
      )
    );
  };

  const removeCard = (listId, cardId) => {
    setLists(
      lists.map((l) =>
        l.id === listId
          ? { ...l, cards: l.cards.filter((c) => c.id !== cardId) }
          : l
      )
    );
  };

  const updateCard = (listId, cardId, field, value) => {
    setLists(
      lists.map((l) =>
        l.id === listId
          ? {
              ...l,
              cards: l.cards.map((c) =>
                c.id === cardId ? { ...c, [field]: value } : c
              ),
            }
          : l
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast("Please enter a template name", "error");
      return;
    }

    // Filter out lists and cards without titles
    const validLists = lists
      .filter((l) => l.title.trim())
      .map((l) => ({
        title: l.title,
        cards: l.cards
          .filter((c) => c.title.trim())
          .map((c) => ({
            title: c.title,
            description: c.description || null,
          })),
      }));

    const templateData = {
      name: name.trim(),
      description: description.trim() || null,
      isPublic,
      lists: validLists,
    };

    setSaving(true);
    try {
      const template = await createTemplate(templateData);
      addToast("Template created successfully!", "success");
      navigate(`/templates/${template.id}`);
    } catch (err) {
      console.error("Failed to create template:", err);
      addToast("Failed to create template. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="create-template-page">
        <div className="create-template-error">
          <p>Please login to create templates.</p>
          <Link to="/templates" className="back-btn">Back to Templates</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="create-template-page">
      <div className="create-template-header">
        <h1>Create New Template</h1>
        <Link to="/templates" className="back-btn">Cancel</Link>
      </div>

      <form onSubmit={handleSubmit} className="create-template-form">
        <div className="form-section">
          <label htmlFor="name">Template Name *</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter template name"
            maxLength={255}
          />
        </div>

        <div className="form-section">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description (optional)"
            rows={3}
            maxLength={2000}
          />
        </div>

        <div className="form-section checkbox-section">
          <label>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Make this template public (visible to all users)
          </label>
        </div>

        <div className="form-section">
          <div className="lists-header">
            <h3>Lists</h3>
            <button type="button" onClick={addList} className="add-list-btn">
              + Add List
            </button>
          </div>

          {lists.length === 0 ? (
            <div className="empty-lists-state">
              <div className="empty-icon">📋</div>
              <p>No lists yet. Click "Add List" to start building your template.</p>
            </div>
          ) : (
            <div className="template-builder-lists">
              {lists.map((list, index) => (
                <div 
                  key={list.id} 
                  className="builder-list"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="builder-list-header">
                    <input
                      type="text"
                      value={list.title}
                      onChange={(e) => updateListTitle(list.id, e.target.value)}
                      placeholder="List title"
                      className="list-title-input"
                    />
                    <button
                      type="button"
                      onClick={() => removeList(list.id)}
                      className="remove-list-btn"
                    >
                      ×
                    </button>
                  </div>

                  <div className="builder-cards">
                    {list.cards.map((card, cardIndex) => (
                      <div 
                        key={card.id} 
                        className="builder-card"
                        style={{ animationDelay: `${(index * 0.05) + (cardIndex * 0.03)}s` }}
                      >
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) =>
                            updateCard(list.id, card.id, "title", e.target.value)
                          }
                          placeholder="Card title"
                          className="card-title-input"
                        />
                        <textarea
                          value={card.description}
                          onChange={(e) =>
                            updateCard(list.id, card.id, "description", e.target.value)
                          }
                          placeholder="Description (optional)"
                          className="card-description-input"
                          rows={2}
                        />
                        <button
                          type="button"
                          onClick={() => removeCard(list.id, card.id)}
                          className="remove-card-btn"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addCard(list.id)}
                      className="add-card-btn"
                    >
                      + Add Card
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <Link to="/templates" className="cancel-btn">
            Cancel
          </Link>
          <button type="submit" className="submit-btn" disabled={saving}>
            {saving ? "Creating..." : "Create Template"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTemplate;
