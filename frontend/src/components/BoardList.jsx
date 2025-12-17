import { useEffect, useState } from 'react';
import { getBoards } from '../api/boards';

function BoardsList() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    getBoards()
      .then(setBoards)
      .catch(err => console.error('Error loading boards:', err));
  }, []);

  return (
    <div>
      <h2>Boards</h2>
      <ul>
        {boards.map(board => (
          <li key={board.id}>
            {board.title} (User ID: {board.userId})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BoardsList;
