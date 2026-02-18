import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getTemplateById, useTemplate as createFromTemplate } from "../api/templates";
import { useAuth } from "../context/authContext";
import { useToast } from "../context/ToastContext";
import "./templatePreview.css";

function TemplatePreview() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [using, setUsing] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      setLoading(true);
      setError(null);
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const data = await getTemplateById(id);
        setTemplate(data);
      } catch (err) {
        console.error("Error fetching template:", err);
        setError("Failed to load template. Please try again.");
        addToast("Failed to load template", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id, user, addToast]);

  const handleUseTemplate = async () => {
    setUsing(true);
    try {
      const board = await createFromTemplate(id);
      if (board && board.id) {
        addToast("Board created from template!", "success");
        navigate(`/boards/${board.id}`);
      }
    } catch (err) {
      console.error("Failed to use template:", err);
      addToast("Failed to create board from template", "error");
    } finally {
      setUsing(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="template-preview-page">
        <div className="templates-loading">
          <div className="loading-spinner"></div>
          <p>Loading template...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !template) {
    return (
      <div className="template-preview-page">
        <div className="templates-error">
          <p>{error || "Template not found"}</p>
          <Link to="/templates" className="back-btn">Back to Templates</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="template-preview-page">
      <div className="template-preview-header">
        <div className="header-info">
          <h1>{template.name}</h1>
          <p className="template-description">{template.description || "No description"}</p>
        </div>
        <div className="header-actions">
          <Link to="/templates" className="back-btn">Back</Link>
          <button 
            className="use-template-btn" 
            onClick={handleUseTemplate}
            disabled={using}
          >
            {using ? "Creating Board..." : "Use Template"}
          </button>
        </div>
      </div>

      <div className="template-preview-content">
        <div className="template-lists-container">
          {template.lists && template.lists.length > 0 ? (
            template.lists.map((list, index) => (
              <div 
                key={list.id} 
                className="template-list"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <h3 className="list-title">{list.title}</h3>
                <div className="list-cards">
                  {list.cards && list.cards.length > 0 ? (
                    list.cards.map((card, cardIndex) => (
                      <div 
                        key={card.id} 
                        className="template-card"
                        style={{ animationDelay: `${(index * 0.05) + (cardIndex * 0.03)}s` }}
                      >
                        <p className="card-title">{card.title}</p>
                        {card.description && (
                          <p className="card-description">{card.description}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="no-cards">No cards in this list</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-lists">
              <div className="empty-icon">📝</div>
              <p>This template has no lists yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TemplatePreview;
