import './BoardDetailView.css'
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import CreateListModal from '../createListModal'
import { TiDelete } from "react-icons/ti";
import { deleteList, updateList } from '../../api/lists';
import { createCards, deleteCard, updateCardTitle } from '../../api/cards';
import { updateBoard } from '../../api/boards';
import InlineEdit from '../InlineEdit/InlineEdit'
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useAuth } from '../../context/authContext';
import { useToast } from '../../context/ToastContext';
import CardDetailModal from '../CardDetailModal/CardDetailModal';

const PRIORITY_COLORS = {
  low: '#22c55e',
  medium: '#eab308', 
  high: '#f97316',
  urgent: '#ef4444'
};

function BoardsDetailView() {
  const { user } = useAuth();
  const { boardId } = useParams();
  const { addToast } = useToast();
  const [board, setBoard] = useState(null);
  const [NewListModal, setNewListModal] = useState(false);
  const [activeListId, setActiveListId] = useState(null);
  const [cardTitle, setCardTitle] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [isEditingBoardDescription, setIsEditingBoardDescription] = useState(false);
  const [boardDescription, setBoardDescription] = useState("");


  const fetchBoard = async () => {
    if (!user) {
      setBoard({ Lists: [] });
      return;
    }
    try {
      const res = await axiosInstance.get(`/boards/${boardId}`);
      setBoard(res.data);
      setBoardDescription(res.data.description || "");
    } catch (err) {
      console.error('Failed to load board details', err);
    }
  };

  useEffect(() => {
    fetchBoard();
  }, [boardId, user])

  const handleBoardDescriptionSave = async () => {
    try {
      await updateBoard(board.id, board.title, boardDescription);
      setIsEditingBoardDescription(false);
      setBoard(prev => ({ ...prev, description: boardDescription }));
      refreshBoard();
    } catch (err) {
      console.error('Failed to update board description:', err);
    }
  };

  const refreshBoard = async () => fetchBoard();

  const handleDeleteList = async (listId) => {
    if (!window.confirm(`Are you sure you want to delete this list?`)) return;
    try {
      await deleteList(listId);
      addToast("List deleted successfully", "success");
      refreshBoard();
    } catch (err) {
      console.error("Failed to delete list:", err);
      addToast("Failed to delete list", "error");
    }
  };

  const handleAddCard = async (targetListId) => {
    if (!cardTitle.trim()) return;
    try {
      await createCards(cardTitle, targetListId, 'medium');
      await refreshBoard();
      setCardTitle("");
      setActiveListId(null);
    } catch (err) {
      console.error("Failed to create card", err);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm(`Are you sure you want to delete this card?`)) return;
    try {
      await deleteCard(cardId);
      addToast("Card deleted successfully", "success");
      refreshBoard();
    } catch (err) {
      console.error("Failed to delete card", err);
      addToast("Failed to delete card", "error");
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination, type } = result;
    if (!destination) return;

    // Handle list reorder
    if (type === "LIST") {
      const newLists = Array.from(board.Lists);
      const [movedList] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, movedList);

      setBoard({ ...board, Lists: newLists });

      await axiosInstance.put("/lists/reorder", {
        boardId: board.id,
        lists: newLists.map((l, i) => ({ id: l.id, position: i }))
      });
      return;
    }

    // Handle card reorder
    if (type === "CARD") {
      const sourceListIndex = board.Lists.findIndex(
        (l) => `list-${l.id}` === source.droppableId
      );
      const destListIndex = board.Lists.findIndex(
        (l) => `list-${l.id}` === destination.droppableId
      );

      const sourceList = board.Lists[sourceListIndex];
      const destList = board.Lists[destListIndex];

      const sourceCards = Array.from(sourceList.Cards);
      const [movedCard] = sourceCards.splice(source.index, 1);

      if (source.droppableId === destination.droppableId) {
        // Reorder within same list
        sourceCards.splice(destination.index, 0, movedCard);
        const newLists = [...board.Lists];
        newLists[sourceListIndex].Cards = sourceCards;
        setBoard({ ...board, Lists: newLists });
      } else {
        // Move to another list
        const destCards = Array.from(destList.Cards);
        destCards.splice(destination.index, 0, movedCard);
        const newLists = [...board.Lists];
        newLists[sourceListIndex].Cards = sourceCards;
        newLists[destListIndex].Cards = destCards;
        setBoard({ ...board, Lists: newLists });
      }

      // Update backend positions
      const updatedCards = [];
      board.Lists.forEach((list) => {
        list.Cards.forEach((card, index) => {
          updatedCards.push({ id: card.id, listId: list.id, position: index });
        });
      });

      await axiosInstance.put("/cards/reorder", { cards: updatedCards });
    }
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isOverdue = date < today;
    const isToday = date.toDateString() === today.toDateString();
    
    return { 
      text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isOverdue,
      isToday
    };
  };

  if (!board) return <p>No board was found ...</p>;

  return (
    <div className='board-container-wrapper'>
      <div className='board-header'>
        <div className='header-info'> 
          <h1>Welcome to {board.title}'s Board!</h1>
          {isEditingBoardDescription ? (
            <div className="board-description-editor">
              <textarea
                value={boardDescription}
                onChange={(e) => setBoardDescription(e.target.value)}
                placeholder="Add a board description..."
                rows={3}
              />
              <div className="editor-actions">
                <button onClick={() => {
                  setIsEditingBoardDescription(false);
                  setBoardDescription(board.description || "");
                }}>Cancel</button>
                <button onClick={handleBoardDescriptionSave}>Save</button>
              </div>
            </div>
          ) : (
            <p 
              className="board-description"
              onClick={() => {
                setIsEditingBoardDescription(true);
                setBoardDescription(board.description || "");
              }}
            >
              {board.description || "Click to add a description..."}
            </p>
          )}
        </div>
        <div className='header-buttons'>
          <Link to="/dashboard" className="back-btn">Back</Link>
          <button onClick={() => setNewListModal(true)}>Create your lists here!</button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="board-lists" direction="horizontal" type="LIST">
          {(provided) => (
            <div
              className="board-container-view"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {board.Lists?.map((list, listIndex) => (
                <Draggable
                  key={list.id}
                  draggableId={`list-${list.id}`}
                  index={listIndex}
                >
                  {(provided) => (
                    <div
                      className="list-container"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className="list-header">
                        <InlineEdit
                          initialValue={list.title}
                          onSave={async (newTitle) => {
                            await updateList(list.id, newTitle);
                            refreshBoard();
                          }}
                          className="list-title-wrapper"
                          textClassName="list-title"
                          refreshBoard={refreshBoard}
                        />
                        <TiDelete
                          className='list-delete-icon'
                          onClick={() => handleDeleteList(list.id)}
                        />
                      </div>

                      <Droppable droppableId={`list-${list.id}`} type="CARD">
                        {(provided) => (
                          <div
                            className='card-container'
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {list.Cards?.map((card, cardIndex) => {
                              const dueInfo = formatDueDate(card.dueDate);
                              return (
                                <Draggable
                                  key={card.id}
                                  draggableId={`card-${card.id}`}
                                  index={cardIndex}
                                >
                                  {(provided) => (
                                    <div
                                      className='card-item'
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      onClick={() => setSelectedCard(card)}
                                    >
                                      {/* Priority Badge */}
                                      {card.priority && card.priority !== 'medium' && (
                                        <span 
                                          className="priority-badge"
                                          style={{ backgroundColor: PRIORITY_COLORS[card.priority] }}
                                        >
                                          {card.priority}
                                        </span>
                                      )}
                                      
                                      {/* Labels */}
                                      {card.labels && card.labels.length > 0 && (
                                        <div className="card-labels">
                                          {card.labels.slice(0, 3).map(label => (
                                            <span 
                                              key={label.id}
                                              className="card-label-dot"
                                              style={{ backgroundColor: label.color }}
                                              title={label.name}
                                            />
                                          ))}
                                        </div>
                                      )}
                                      
                                      <InlineEdit
                                        initialValue={card.title}
                                        onSave={async (newTitle) => {
                                          await updateCardTitle(card.id, newTitle);
                                          refreshBoard();
                                        }}
                                        className="card-title-wrapper"
                                        textClassName="card-title"
                                        refreshBoard={refreshBoard}
                                      />
                                      
                                      {/* Card Description */}
                                      {card.description && (
                                        <p className="card-item-description">{card.description}</p>
                                      )}
                                      
                                      {/* Due Date */}
                                      {dueInfo && (
                                        <span className={`due-date-badge ${dueInfo.isOverdue ? 'overdue' : ''} ${dueInfo.isToday ? 'today' : ''}`}>
                                          📅 {dueInfo.text}
                                        </span>
                                      )}
                                      
                                      {/* Comments Count */}
                                      {card.comments && card.comments.length > 0 && (
                                        <span className="comments-count">
                                          💬 {card.comments.length}
                                        </span>
                                      )}
                                      
                                      <TiDelete
                                        className='delete-card-icon'
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteCard(card.id);
                                        }}
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}

                            {activeListId === list.id ? (
                              <div className='card-input-container'>
                                <input
                                  type='text'
                                  value={cardTitle}
                                  placeholder='Card name'
                                  onChange={(e) => setCardTitle(e.target.value)}
                                />
                                <div className='card-input-actions'>
                                  <button className='cancel-card-btn' onClick={() => {
                                    setActiveListId(null);
                                    setCardTitle("");
                                  }}>x</button>
                                  <button className='add-card-btn' onClick={() => handleAddCard(list.id)}>+</button>
                                </div>
                              </div>
                            ) : (
                              <button
                                className='new-card-button'
                                onClick={() => setActiveListId(list.id)}
                              >
                                Add Card
                              </button>
                            )}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {NewListModal && (
        <CreateListModal
          onClose={() => setNewListModal(false)}
          refreshBoard={refreshBoard}
        />
      )}

      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          onClose={() => {
            setSelectedCard(null);
            refreshBoard();
          }}
          refreshBoard={refreshBoard}
        />
      )}
    </div>
  );
}

export default BoardsDetailView;
