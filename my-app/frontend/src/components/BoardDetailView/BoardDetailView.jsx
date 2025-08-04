import './BoardDetailView.css'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import CreateListModal from '../createListModal'
import { TiDelete } from "react-icons/ti";
import { deleteList } from '../../api/lists';
import { createCards } from '../../api/cards';

function BoardsDetailView() {
    const {listId, boardId} = useParams()    
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

  const refreshBoard = async() => {
    try {
      const res = await axiosInstance.get(`/boards/${boardId}`)
      setBoard(res.data)
    } catch (err) {
        console.error('Failed to load board', err)
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

  const handleAddCard = async () => {
    if(!cardTitle.trim()) return;

    try {
      await createCards({ title: cardTitle, listId})
      await refreshBoard()
      setCardTitle("")
    } catch (err) {
      return ("Failed to create Card", err)
    }
  }

  if(!board) return <p>No board was found ...</p>
    console.log('board:', board)


  return (
    <div className='board-container-wrapper'>
      <div className='board-header'>
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
          <div key={list.id} className='list-card'>
            <TiDelete className='delete-icon' 
            onClick={() => handleDeleteList(list.id)} 
            />
            <h4>{list.title}</h4>
            <ul className='card-list'>
              {list.Cards?.map((card) => (
                <li key={card.id} className='card-item'>{card.title}</li>
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
                    <button className='add-card-btn' onClick={() => handleAddCard()}>+</button>
                    <button className='cancel-card-btn' onClick={() => setActiveListId(null)}>x</button>
                  </div>
                </div>
              ) : (
              <button className='new-card-button'
                onClick={() => setActiveListId(list.id)}
                >Add Card</button> 
              )
              }
            </ul>
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