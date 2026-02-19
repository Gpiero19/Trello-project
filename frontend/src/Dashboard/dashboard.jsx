import './dashboard.css'
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { getBoards, deleteBoard, updateBoard } from "../api/boards";
import CreateBoardModal from "../components/createBoardModal";
import { Link } from "react-router-dom";
import { TiDelete } from "react-icons/ti";
import InlineEdit from '../components/InlineEdit/InlineEdit';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/authContext';
import { useToast } from '../context/ToastContext';

function Dashboard () {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [boards, setBoards] = useState([]);
  const [NewBoardModal, setNewBoardModal] = useState(false);

  const refreshBoards = async () => {
    if (!user) {
      setBoards([]);
      return;
    }
    try {
      const data = await getBoards(user?.id);
      setBoards(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching boards:", err) ;
    }
  };

  useEffect(() => {
    refreshBoards();
  }, [user]);

  const handleDeleteBoard = async (boardId) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this board?`);
    if (!confirmDelete) return;

    try {
      await deleteBoard(boardId, user?.id);
      addToast("Board deleted successfully", "success");
      refreshBoards();
    } catch (err) {
      console.error("Failed to delete board:", err);
      addToast("Failed to delete board.", "error");
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;

    const newBoards = Array.from(boards);
    const [movedBoard] = newBoards.splice(source.index, 1);
    newBoards.splice(destination.index, 0, movedBoard);

    setBoards(newBoards);

    try {
      await axiosInstance.put("/boards/reorder", {
        boards: newBoards.map((b, i) => ({ id: b.id, position: i }))
      });
      console.log(newBoards.map(b => b.id));
    } catch (err) {
      console.error("Failed to reorder boards:", err);
      addToast("Failed to save board order. Reverting changes.", "error");
      refreshBoards();
    }
  };
    
  return (
  <div className="view-container-wrapper">

    {!user && (
      <div className="homepage">
        <h2>Welcome to Frello!</h2>
        <p>You don't have any boards yet. Create a user to start creating boards to continue the adventure!</p>
      </div>
     )}
      {user && <button onClick={() => setNewBoardModal(true)}>+ New Board</button>}

      {NewBoardModal && (
        <CreateBoardModal
          userId={user?.id}
          setBoards={refreshBoards}
          onClose={() => setNewBoardModal(false)}
        />
      )}
      
      <DragDropContext onDragEnd={handleDragEnd}>
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
                  {(provided, snapshot) => (
                    <div 
                      className={`board-card ${snapshot.isDragging ? 'dragging' : ''}`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                        <div className="board-card-header">
                          <InlineEdit
                            initialValue={board.title}
                            onSave={async (newTitle) => {
                              await updateBoard(board.id, newTitle);
                              setBoards(prev =>
                                prev.map(b => b.id === board.id ? { ...b, title: newTitle } : b)
                              );
                            }}
                            className="board-card-title"
                            textClassName="board-title"
                          />
                          <TiDelete className='delete-icon' 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBoard(board.id);
                            }} 
                          />
                        </div>
                        <Link to={`/boards/${board.id}`} className='board-card-link'>
                          {board.description && <p className='board-description'>{board.description}</p>}
                          <div className="board-stats">
                            <span>{board.Lists?.length || 0} lists</span>
                            <span>
                              {board.Lists?.reduce((acc, list) => acc + (list.Cards?.length || 0), 0) || 0} cards
                            </span>
                          </div>
                        </Link>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
      </DragDropContext>
    </div>
  );
}

export default Dashboard;
