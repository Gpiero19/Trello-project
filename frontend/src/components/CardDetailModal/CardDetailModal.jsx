import './CardDetailModal.css';
import { useState, useEffect } from 'react';
import { 
  updateCard, 
  getCardById, 
  addComment, 
  deleteComment,
  addLabelToCard,
  removeLabelFromCard
} from '../../api/cards';
import { getLabelsByBoard, createLabel, deleteLabel } from '../../api/labels';

const PRIORITY_COLORS = {
  low: '#22c55e',
  medium: '#eab308', 
  high: '#f97316',
  urgent: '#ef4444'
};

const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent'
};

function CardDetailModal({ card, onClose, refreshBoard }) {
  const [cardData, setCardData] = useState(card);
  const [comments, setComments] = useState(card.comments || []);
  const [labels, setLabels] = useState(card.labels || []);
  const [boardLabels, setBoardLabels] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('#3b82f6');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState(card.description || '');

  // Fetch full card data on mount
  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        const data = await getCardById(card.id);
        setCardData(data);
        setComments(data.comments || []);
        setLabels(data.labels || []);
      } catch (err) {
        console.error('Failed to fetch card details:', err);
      }
    };
    fetchCardDetails();
  }, [card.id]);

  // Fetch board labels
  useEffect(() => {
    const fetchBoardLabels = async () => {
      try {
        // Get boardId from the card's list
        const data = await getCardById(card.id);
        if (data.list?.boardId) {
          const boardLabels = await getLabelsByBoard(data.list.boardId);
          setBoardLabels(boardLabels);
        }
      } catch (err) {
        console.error('Failed to fetch board labels:', err);
      }
    };
    fetchBoardLabels();
  }, [card.id]);

  const handlePriorityChange = async (priority) => {
    try {
      await updateCard(card.id, { priority });
      setCardData({ ...cardData, priority });
      refreshBoard();
    } catch (err) {
      console.error('Failed to update priority:', err);
    }
  };

  const handleDueDateChange = async (e) => {
    const dueDate = e.target.value ? new Date(e.target.value).toISOString() : null;
    try {
      await updateCard(card.id, { dueDate });
      setCardData({ ...cardData, dueDate });
      refreshBoard();
    } catch (err) {
      console.error('Failed to update due date:', err);
    }
  };

  const handleDescriptionSave = async () => {
    try {
      await updateCard(card.id, { description });
      setIsEditingDescription(false);
      setCardData(prev => ({ ...prev, description }));
      refreshBoard();
    } catch (err) {
      console.error('Failed to update description:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      const comment = await addComment(card.id, newComment);
      setComments([...comments, comment]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const handleAddLabel = async (labelId) => {
    try {
      await addLabelToCard(card.id, labelId);
      const label = boardLabels.find(l => l.id === labelId);
      if (label) {
        setLabels([...labels, label]);
      }
      setShowLabelPicker(false);
      refreshBoard();
    } catch (err) {
      console.error('Failed to add label:', err);
    }
  };

  const handleRemoveLabel = async (labelId) => {
    console.log('Removing label:', labelId, 'from card:', card.id);
    try {
      await removeLabelFromCard(Number(card.id), Number(labelId));
      setLabels(labels.filter(l => l.id !== labelId && l.id !== Number(labelId)));
      refreshBoard();
    } catch (err) {
      console.error('Failed to remove label:', err);
    }
  };

  const handleDeleteLabel = async (labelId) => {
    if (!window.confirm('Are you sure you want to delete this label? It will be removed from all cards.')) {
      return;
    }
    try {
      await deleteLabel(Number(labelId));
      setBoardLabels(boardLabels.filter(l => l.id !== labelId && l.id !== Number(labelId)));
      setLabels(labels.filter(l => l.id !== labelId && l.id !== Number(labelId)));
      refreshBoard();
    } catch (err) {
      console.error('Failed to delete label:', err);
    }
  };

  const handleCreateLabel = async () => {
    if (!newLabelName.trim()) return;
    
    try {
      // Get boardId first
      const data = await getCardById(card.id);
      const label = await createLabel(data.list.boardId, newLabelName, newLabelColor);
      setBoardLabels([...boardLabels, label]);
      await addLabelToCard(card.id, label.id);
      setLabels([...labels, label]);
      setNewLabelName('');
      setShowLabelPicker(false);
      refreshBoard();
    } catch (err) {
      console.error('Failed to create label:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = cardData.dueDate && new Date(cardData.dueDate) < new Date() && !cardData.isCompleted;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="card-detail-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <input
            type="text"
            className="card-title-input"
            value={cardData.title}
            onChange={(e) => setCardData({ ...cardData, title: e.target.value })}
            onBlur={() => {
              updateCard(card.id, { title: cardData.title });
              refreshBoard();
            }}
          />
        </div>

        <div className="modal-body">
          {/* Left Column */}
          <div className="modal-main">
            {/* Labels Section */}
            <div className="card-section">
              <h4>Labels</h4>
              <div className="labels-container">
                {labels.map(label => (
                  <span 
                    key={label.id} 
                    className="label-badge"
                    style={{ backgroundColor: label.color }}
                  >
                    {label.name}
                    <button 
                      className="label-remove"
                      onClick={() => handleRemoveLabel(label.id)}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <button 
                  className="add-label-btn"
                  onClick={() => setShowLabelPicker(!showLabelPicker)}
                >
                  + Add
                </button>
              </div>
              
              {showLabelPicker && (
                <div className="label-picker">
                  {boardLabels
                    .filter(l => !labels.find(cl => cl.id === l.id))
                    .map(label => (
                      <div key={label.id} className="label-option-row">
                        <button
                          className="label-option"
                          style={{ backgroundColor: label.color }}
                          onClick={() => handleAddLabel(label.id)}
                        >
                          {label.name}
                        </button>
                        <button
                          className="label-delete-btn"
                          onClick={() => handleDeleteLabel(label.id)}
                          title="Delete label"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  }
                  <div className="new-label-form">
                    <input
                      type="text"
                      placeholder="New label name"
                      value={newLabelName}
                      onChange={(e) => setNewLabelName(e.target.value)}
                    />
                    <input
                      type="color"
                      value={newLabelColor}
                      onChange={(e) => setNewLabelColor(e.target.value)}
                    />
                    <button onClick={handleCreateLabel}>Create</button>
                  </div>
                </div>
              )}
            </div>

            {/* Description Section */}
            <div className="card-section">
              <h4>Description</h4>
              {isEditingDescription ? (
                <div className="description-editor">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a description (Markdown supported)..."
                    rows={5}
                  />
                  <div className="editor-actions">
                    <button onClick={handleDescriptionSave}>Save</button>
                    <button onClick={() => setIsEditingDescription(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div 
                  className="description-display"
                  onClick={() => setIsEditingDescription(true)}
                >
                  {cardData.description || 'Click to add a description...'}
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="card-section">
              <h4>Comments</h4>
              <form onSubmit={handleAddComment} className="comment-form">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  rows={3}
                />
                <button type="submit" disabled={!newComment.trim()}>Add Comment</button>
              </form>
              
              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <span className="comment-author">{comment.author?.name || 'User'}</span>
                      <span className="comment-date">{formatDate(comment.createdAt)}</span>
                      <button 
                        className="delete-comment-btn"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        ×
                      </button>
                    </div>
                    <p className="comment-content">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="modal-sidebar">
            {/* Priority */}
            <div className="sidebar-section">
              <h4>Priority</h4>
              <select
                value={cardData.priority || 'medium'}
                onChange={(e) => handlePriorityChange(e.target.value)}
                className="priority-select"
                style={{ borderLeftColor: PRIORITY_COLORS[cardData.priority || 'medium'] }}
              >
                {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div className="sidebar-section">
              <h4>Due Date</h4>
              <input
                type="date"
                value={cardData.dueDate ? cardData.dueDate.split('T')[0] : ''}
                onChange={handleDueDateChange}
                className={`due-date-input ${isOverdue ? 'overdue' : ''}`}
              />
              {isOverdue && <span className="overdue-badge">Overdue!</span>}
            </div>

            {/* Card Info */}
            <div className="sidebar-section">
              <h4>Card Info</h4>
              <p className="card-id">Card ID: {card.id}</p>
              <p className="card-list">List: {cardData.list?.title || 'Unknown'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardDetailModal;
