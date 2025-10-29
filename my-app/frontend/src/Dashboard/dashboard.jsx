import './dashboard.css'
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { getBoards, deleteBoard, updateBoard } from "../api/boards";
import CreateBoardModal from "../components/createBoardModal";
import { Link } from "react-router-dom";
import { TiDelete } from "react-icons/ti";
import InlineEdit from '../components/InlineEdit/InlineEdit';
import axiosInstance from '../api/axiosInstance';

function Dashboard () {
  const[ boards, setBoards ] = useState([])
  const [ NewBoardModal, setNewBoardModal ] = useState(false);

  const refreshBoards = async () => {
    try {
      const data = await getBoards();
      setBoards(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching boards:", err);
    }
  };

  useEffect(() => {
    refreshBoards()
  }, []);

  const handleDeleteBoard = async (boardId) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this board?`);
    if (!confirmDelete) return;

    try {
      await deleteBoard(boardId);
      // setBoards(prev => prev.filter(board => board.id !== boardId));
      refreshBoards()
    } catch (err) {
      console.error("Failed to delete board:", err);
      alert("Failed to delete board.");
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return; // dropped outside

    if (source.index === destination.index) return; // no movement

    // create new order array
    const newBoards = Array.from(boards);
    const [movedBoard] = newBoards.splice(source.index, 1);
    newBoards.splice(destination.index, 0, movedBoard);

    // update UI immediately
    setBoards(newBoards);

    try {
      // 3. Call backend with the new position array
      await axiosInstance.put("/boards/reorder", {
        boards: newBoards.map((b, i) => ({ id: b.id, position: i }))
      });
      // Success: UI is already updated, nothing else needed.

    } catch (err) {
      console.error("Failed to reorder boards:", err);
      // 4. Failure: Revert UI state by fetching the canonical data from the DB
      alert("Failed to save board order. Reverting changes.");
      refreshBoards(); // Revert to database state
    }
  };
  //   // call backend
  //   await axiosInstance.put("/boards/reorder", {
  //     boards: newBoards.map((b, i) => ({ id: b.id, position: i }))
  //   });
  // };
    
  return (
  <div className="view-container-wrapper">

      <button onClick={() => setNewBoardModal(true)}>+ New Board</button>


      {NewBoardModal && (
        <CreateBoardModal
            setBoards={refreshBoards}
            onClose={() => setNewBoardModal(false)}
            />
            )}
      
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="board-container">
        <Droppable droppableId="dashboard" direction="horizontal">
          {(provided) => (
            <div
              className="boards-container"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
            {boards.map((board, position) => (
            <Draggable 
              key={board.id} 
              draggableId={board.id.toString()}
              index={position}
              >
              {(provided) => (
                <div 
                  className="board-card"
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <InlineEdit
                      initialValue={board.title}
                      onSave={async (newTitle) => {
                        await updateBoard(board.id, newTitle);
                        setBoards(prev =>
                          prev.map(b => b.id === board.id ? { ...b, title: newTitle } : b)
                        );
                      }}
                      className="board-card"
                      textClassName="board-title"
                    />
                  <Link to={`/boards/${board.id}`} className='board-link'>
                    <p>User ID: {board.userId}</p>
                    <p>Board ID: {board.id}</p>
                  </Link>
                  <TiDelete className='delete-icon' 
                    onClick={() => handleDeleteBoard(board.id)} 
                    />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
        )}
        </Droppable>
      </div>
    </DragDropContext>
  </div>
  );
}

export default Dashboard