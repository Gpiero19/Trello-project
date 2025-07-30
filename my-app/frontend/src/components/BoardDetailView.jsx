import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function BoardsDetailView() {
    const {boardId} = useParams()    
    const [board, setBoard] = useState(null);


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

    if(!board) return <p>Loading ...</p>
    if(board.Lists.length === 0) { 
        return <h2>Create your first List!</h2>
    }

  return (
    <div>
      <h2>Welcome to {board.title}</h2>
        {board.Lists.map(list => (
          <div key={list.id}>
            <h4>{list.title}</h4>
            <ul>
                {list.Cards.map(card => (
                    <li key={card.id}>{card.title}</li>
                ))}
            </ul>
          </div>
        ))}
    </div>
  );
}

export default BoardsDetailView;