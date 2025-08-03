import './dashboard.css'
import { useEffect, useState } from "react";
import { getBoards, deleteBoard } from "../api/boards";
import CreateBoardModal from "../components/createBoardModal";
import { Link } from "react-router-dom";
import { TiDelete } from "react-icons/ti";

function Dashboard () {
  const [boards, setBoard] = useState([])
  const [NewBoardModal, setNewBoardModal] = useState(false);

  useEffect(() => {
  getBoards()
      .then(setBoard)
      .catch((err) => console.error("Error fetching boards:", err));
  }, []);

  const handleDeleteBoard = async (boardId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this board?");
    if (!confirmDelete) return;

    try {
      await deleteBoard(boardId);
      setBoard(prev => prev.filter(board => board.id !== boardId));
    } catch (err) {
      console.error("Failed to delete board:", err);
      alert("Failed to delete board.");
    }
  };

    
  return (
    <div className="view-container-wrapper">

      <button onClick={() => setNewBoardModal(true)}>+ New Board</button>


      {NewBoardModal && (
          <CreateBoardModal
              setBoards={setBoard}
              onClose={() => setNewBoardModal(false)}
              />
              )}
      

    <div className="board-container">
      {boards.map((board) => (
        <div key={board.id} className="board-view">
          <Link to={`/boards/${board.id}`} className='board-link'>
            <h3>{board.title}</h3>
            <p>User ID: {board.userId}</p>
            <p>Board ID: {board.id}</p>
          </Link>
          <TiDelete className='delete-icon' 
            onClick={() => handleDeleteBoard(board.id)} 
            />
        </div>
      ))}
    </div>
  </div>
);
}

export default Dashboard