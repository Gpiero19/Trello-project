import './BoardDetailView.css'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import CreateListModal from '../createListModal'
import { TiDelete } from "react-icons/ti";
import { deleteList } from '../../api/lists';

function BoardsDetailView() {
    const {boardId} = useParams()    
    // const {listId} = useParams()    
    const [board, setBoard] = useState(null);
    // const [list, setList] = useState(null);
    const [NewListModal, setNewListModal] = useState(false);


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
        <divv>
          <p>You don't have any lists in this Board yet!</p>
        </divv>
      ) : (
        board.Lists.map((list) => (
          <div key={list.id} className='list-card'>
            <TiDelete className='delete-icon' 
            onClick={() => handleDeleteList(list.id)} 
            />
            <h4>{list.title}</h4>
            <ul className='card-list'>
              {list.Cards.map((card) => (
                <li key={card.id} className='card-item'>{card.title}</li>
              ))}
              <button className='new-card-button'>Add Card</button> 
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