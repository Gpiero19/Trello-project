import './BoardDetailView.css'
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import CreateListModal from '../createListModal'
import { TiDelete } from "react-icons/ti";
import { deleteList, updateList } from '../../api/lists';
import { createCards, deleteCard, updateCardTitle } from '../../api/cards';
import InlineEdit from '../InlineEdit/InlineEdit'
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

function BoardsDetailView() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [NewListModal, setNewListModal] = useState(false);
  const [activeListId, setActiveListId] = useState(null);
  const [cardTitle, setCardTitle] = useState("");

  const navigate = useNavigate();

  const fetchBoard = async () => {
    try {
      const res = await axiosInstance.get(`/boards/${boardId}`);
      setBoard(res.data);
    } catch (err) {
      console.error('Failed to load board details', err);
    }
  };

  useEffect(() => {
     async function fetchBoard () {
      try {
          const res = await axiosInstance.get(`/boards/${boardId}`);
          console.log('Fetched board data:', res.data); // <-- check this
          setBoard(res.data)
      } catch (err) {
          console.error('Failed to load board details', err)
      }
  }
  fetchBoard();
}, [boardId])

  const refreshBoard = async () => fetchBoard();

  const handleDeleteList = async (listId) => {
    if (!window.confirm(`Are you sure you want to delete this list?`)) return;
    try {
      await deleteList(listId);
      refreshBoard();
    } catch (err) {
      console.error("Failed to delete list:", err);
    }
  };

  const handleAddCard = async (targetListId) => {
    if (!cardTitle.trim()) return;
    try {
      await createCards(cardTitle, targetListId);
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
      refreshBoard();
    } catch (err) {
      console.error("Failed to delete card", err);
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

  if (!board) return <p>No board was found ...</p>;

  return (
    <div className='board-container-wrapper'>
      <div className='board-header'>
        <button onClick={() => navigate(-1)}>Back</button>
        <h2 className='board-title'>Welcome to {board.title}'s Board!</h2>
        <button onClick={() => setNewListModal(true)}>Create your lists here!</button>
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
                            {list.Cards?.map((card, cardIndex) => (
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
                                  >
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
                                    <TiDelete
                                      className='delete-card-icon'
                                      onClick={() => handleDeleteCard(card.id)}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
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
                                  <button className='add-card-btn' onClick={() => handleAddCard(list.id)}>+</button>
                                  <button className='cancel-card-btn' onClick={() => {
                                    setActiveListId(null);
                                    setCardTitle("");
                                  }}>x</button>
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
    </div>
  );
}

export default BoardsDetailView;
