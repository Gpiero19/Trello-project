import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTemplates, useTemplate as createBoardFromTemplate, deleteTemplate } from "../api/templates";
import { useAuth } from "../context/authContext";
import { useToast } from "../context/ToastContext";
import { TiDelete } from "react-icons/ti";
import { FaClipboardList } from "react-icons/fa";
import Skeleton from "../components/ui/Skeleton";
import "./templates.css";

function Templates() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [usingId, setUsingId] = useState(null);

  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTemplates();
      setTemplates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching templates:", err);
      setError("Failed to load templates. Please try again.");
      addToast("Failed to load templates", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [user]);

  const handleUseTemplate = async (templateId) => {
    setUsingId(templateId);
    try {
      const board = await createBoardFromTemplate(templateId);
      if (board && board.id) {
        addToast("Board created successfully!", "success");
        navigate(`/boards/${board.id}`);
      }
    } catch (err) {
      console.error("Failed to use template:", err);
      addToast("Failed to create board from template", "error");
    } finally {
      setUsingId(null);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    setDeletingId(templateId);
    try {
      await deleteTemplate(templateId);
      addToast("Template deleted successfully", "success");
      fetchTemplates();
    } catch (err) {
      console.error("Failed to delete template:", err);
      addToast("Failed to delete template", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="templates-page">
      <div className="templates-header">
        <h1>Templates</h1>
        {user && (
          <Link to="/templates/create" className="create-template-btn">
            + Create Template
          </Link>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="templates-grid">
          {[0, 1, 2].map((i) => (
            <div className="template-card" key={i}>
              <Skeleton style={{ width: '70%', height: '18px', marginBottom: '12px' }} />
              <Skeleton style={{ width: '100%', height: '14px', marginBottom: '6px' }} />
              <Skeleton style={{ width: '90%', height: '14px', marginBottom: '16px' }} />
              <Skeleton style={{ width: '100%', height: '38px' }} />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="templates-error">
          <p>{error}</p>
          <button onClick={fetchTemplates} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      {/* Not Logged In */}
      {!loading && !error && !user && (
        <div className="templates-empty">
          <div className="empty-icon"><FaClipboardList aria-hidden="true" /></div>
          <p>Please login to view and create templates.</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && user && templates.length === 0 && (
        <div className="templates-empty">
          <div className="empty-icon"><FaClipboardList aria-hidden="true" /></div>
          <p>No templates found.</p>
          <p className="empty-subtitle">Create your first template to get started!</p>
          <Link to="/templates/create" className="create-template-btn">
            + Create Template
          </Link>
        </div>
      )}

      {/* Templates Grid */}
      {!loading && !error && templates.length > 0 && (
        <div className="templates-grid">
          {templates.map((template) => (
            <div key={template.id} className="template-card">
              <div className="template-card-header">
                <h3>{template.name}</h3>
                {template.userId === user?.id && (
                  <TiDelete
                    className="delete-template-btn"
                    role="button"
                    tabIndex={0}
                    aria-label={`Delete template "${template.name}"`}
                    aria-disabled={deletingId === template.id}
                    onClick={() => {
                      if (deletingId !== template.id) handleDeleteTemplate(template.id);
                    }}
                    onKeyDown={(e) => {
                      if ((e.key === "Enter" || e.key === " ") && deletingId !== template.id) {
                        e.preventDefault();
                        handleDeleteTemplate(template.id);
                      }
                    }}
                  />
                )}
              </div>
              <p className="template-description">
                {template.description || "No description"}
              </p>
              <div className="template-stats">
                <span>{template.lists?.length || 0} lists</span>
                <span>
                  {template.lists?.reduce((acc, list) => acc + (list.cards?.length || 0), 0) || 0} cards
                </span>
              </div>
              <div className="template-card-actions">
                <Link to={`/templates/${template.id}`} className="preview-btn">
                  Preview
                </Link>
                <button
                  className="use-template-btn"
                  onClick={() => handleUseTemplate(template.id)}
                  disabled={usingId === template.id}
                >
                  {usingId === template.id ? "Creating..." : "Use Template"}
                </button>
              </div>
              {template.isPublic && (
                <span className="public-badge">Public</span>
              )}
              {template.userId && template.userId !== user?.id && (
                <span className="user-badge">By: {template.user?.name || "Unknown"}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Templates;
