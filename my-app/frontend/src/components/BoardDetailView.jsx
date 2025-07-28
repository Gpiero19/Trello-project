import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function BoardsDetailView() {
    const [board, setBoards] = useState(null);
    const {boardId} = useParams()    


  useEffect(() => {
    async function fetchBoard () {
        try {
            const res = await axiosInstance.get(`/boards/${boardId}/details`);
            setBoards(res.data)
        } catch (err) {
            console.error('Failed to load board details', err)
        }
    }
    fetchBoard();
}, [boardId])

    if(!board) return <p>Loading ...</p>

  return (
    <div>
      <h2>Welcome to {board.title}</h2>
      <ul>
        {board.lists.map(list => (
          <li key={list.id}>
            {list.title}
            <ul>
                {list.cards.map(card => (
                    <li key={card.id}>{card.title}</li>
                ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BoardsDetailView;