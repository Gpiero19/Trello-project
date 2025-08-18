import './BoardDetailView.css'
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import CreateListModal from '../createListModal'
import { TiDelete } from "react-icons/ti";
import { deleteList, updateList } from '../../api/lists';
import { createCards, deleteCard, updateCardTitle } from '../../api/cards';
// import { useBoard } from '../../api/useBoard';
import InlineEdit from '../InlineEdit/InlineEdit'


function BoardsDetailView() {
    const {boardId} = useParams()    
    const [board, setBoard] = useState(null);
    const [NewListModal, setNewListModal] = useState(false);
    const [activeListId, setActiveListId] = useState(null);
    const [cardTitle, setCardTitle] = useState("")


  useEffect(() => {
    async function fetchBoard () {
        try {
            const res = await axiosInstance.get(`/boards/${boardId}`);
            setBoard(res.data)
        } catch (err) {
            console.error('Failed to load board details', err)
        }
    }
    fetchBoard();
}, [boardId])

  const navigate = useNavigate()

  const refreshBoard = async () => {
  try {
    const res = await axiosInstance.get(`/boards/${boardId}`);
    setBoard(res.data);
  } catch (err) {
    console.error('Failed to load boards', err);
  }
}

  const handleDeleteList = async (listId) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this list?`);
    if (!confirmDelete) return;
    try {
      await deleteList(listId);
      refreshBoard();
    } catch (err) {
      console.error("Failed to delete list:", err);
      alert("Failed to delete list.");
    }
  };

  const handleAddCard = async (targetListId) => {
    if(!cardTitle.trim()) return;
      console.log(typeof(cardTitle));
      console.log("targetListId:", targetListId);

    try {
      await createCards(cardTitle, targetListId)
      await refreshBoard()
      setCardTitle("")
    } catch (err) {
      return ("Failed to create Card", err)
    }
  }

  const handleDeleteCard = async (cardId) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this card?`);
    if (!confirmDelete) return;
    try {
      await deleteCard(cardId)
      refreshBoard()
    } catch (err) {
      throw new Error ('Failed to delete card', err)
    }
  }

  if(!board) return <p>No board was found ...</p>
    console.log('board:', board)


  return (
    <div className='board-container-wrapper'>
      <div className='board-header'>
        <button onClick={()=> navigate(-1)}>Back</button>
        <h2 className='board-title'>Welcome to {board.title}'s Board!</h2>
        <button className='' onClick={() => setNewListModal(true)}>Create your lists here!</button>
      </div>

    <div className='board-container-view'>
      {(!board.Lists || board.Lists.length === 0) ? (
        <div>
          <p>You don't have any lists in this Board yet!</p>
        </div>
      ) : (
        board.Lists.map((list) => (
          <div key={list.id} className='list-container'>
            <TiDelete className='list-delete-icon' 
            onClick={() => handleDeleteList(list.id)} 
            />
            {/* <h4>{list.title}</h4> */}
            <InlineEdit
              initialValue={list.title}
              onSave={async (newTitle) => {
                await updateList(list.id, newTitle);
                refreshBoard();
              }}
              className="list-title-wrapper"
              textClassName="list-title"
              refreshBoard ={refreshBoard}
            />
            <div className='card-container'>
              {list.Cards?.map((card) => (
                <div key={card.id} className='card-item'>
                {/* <span>{card.title}</span> */}
                <InlineEdit
                  initialValue={card.title}
                  onSave={async (newTitle) => {
                    await updateCardTitle(card.id, newTitle);
                    refreshBoard();
                  }}
                  className="card-title-wrapper"
                  textClassName="card-title"
                  refreshBoard ={refreshBoard}
                />
                <TiDelete className='delete-card-icon' 
                onClick={() => handleDeleteCard(card.id)} 
                />
                </div>
              ))}

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
                      setCardTitle();
                    }}>x</button>
                  </div>
                </div>
              ) : (
              <button className='new-card-button'
                onClick={() => setActiveListId(list.id)}
                >Add Card</button> 
              )
              }
            </div>
          </div>
        ))
      )}
    </div>

      {NewListModal && (
      <CreateListModal 
        onClose={() => setNewListModal(false)}
        refreshBoard ={refreshBoard}
      />
      )}
    </div>
  )
};

export default BoardsDetailView;