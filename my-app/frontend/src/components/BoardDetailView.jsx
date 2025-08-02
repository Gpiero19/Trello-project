import './BoardDetailView.css'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import CreateListModal from './createListModal'

function BoardsDetailView() {
    const {boardId} = useParams()    
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

  if(!board) return <p>No board was found ...</p>
    console.log('board:', board)


  return (
    <div className='board-container-wrapper'>
      <div className='board-header'>
        <h2 className='board-title'>Welcome to {board.title}'s Board!</h2>
        <button className='' onClick={() => setNewListModal(true)}>Creat your lists here!</button>
      </div>

    <div className='board-container'>
      {(!board.Lists || board.Lists.length === 0) ? (
        <div>
          <p>No lists yet</p>
        </div>
      ) : (
        board.Lists.map((list) => (
          <div key={list.id} className='list-card'>
            <h4>{list.title}</h4>
            <ul className='card-list'>
              {list.Cards.map((card) => (
                <li key={card.id} className='card-item'>{card.title}</li>
              ))}
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