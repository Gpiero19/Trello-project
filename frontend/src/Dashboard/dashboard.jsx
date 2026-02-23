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
import { getGuestBoards, deleteGuestBoard, updateGuestBoardTitle, isGuestBoard, getGuestBoard } from '../api/guestStorage';

function Dashboard () {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [boards, setBoards] = useState([]);
  const [NewBoardModal, setNewBoardModal] = useState(false);

  const refreshBoards = async () => {
    if (!user) {
      // Guest mode - load from localStorage with full data
      const guestBoards = getGuestBoards();
      // Load full board data for each guest board
      const fullBoards = guestBoards.map(boardMeta => {
        const fullBoard = getGuestBoard(boardMeta.id);
        return fullBoard || boardMeta;
      }).filter(Boolean);
      // Filter out any boards without valid IDs
      const validBoards = fullBoards.filter(b => b && b.id);
      setBoards(validBoards);
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

    const isGuest = isGuestBoard(boardId);
    
    try {
      if (isGuest) {
        await deleteGuestBoard(boardId);
        addToast("Board deleted successfully", "success");
      } else {
        await deleteBoard(boardId, user?.id);
        addToast("Board deleted successfully", "success");
      }
      refreshBoards();
    } catch (err) {
      console.error("Failed to delete board:", err);
      addToast("Failed to delete board.", "error");
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;

    // Skip reorder for guest boards
    if (!user) {
      addToast("Please login to reorder boards", "info");
      return;
    }

    const newBoards = Array.from(boards);
    const [movedBoard] = newBoards.splice(source.index, 1);
    newBoards.splice(destination.index, 0, movedBoard);

    console.log('[DragDebug] Source index:', source.index, 'Destination index:', destination.index);
    console.log('[DragDebug] Board IDs being sent:', newBoards.map((b, i) => ({ id: b.id, position: i, idType: typeof b.id })));

    setBoards(newBoards);

    try {
      await axiosInstance.put("/boards/reorder", {
        boards: newBoards.map((b, i) => ({ id: b.id, position: i }))
      });
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
        <p>
          Try the app instantly in Guest Mode — no registration required. Use our ready-made templates or create your own boards, lists, and cards.
        <br />
          Want to keep your progress and unlock all features? Create an account or log in anytime.
        </p>
      </div>
     )}
      <button onClick={() => setNewBoardModal(true)}>+ New Board</button>

      {NewBoardModal && (
        <CreateBoardModal
          userId={user?.id}
          setBoards={refreshBoards}
          onClose={() => setNewBoardModal(false)}
        />
      )}
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard">
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
                              if (isGuestBoard(board.id)) {
                                await updateGuestBoardTitle(board.id, newTitle);
                              } else {
                                await updateBoard(board.id, newTitle);
                              }
                              setBoards(prev =>
                                prev.map(b => b.id === board.id ? { ...b, title: newTitle } : b)
                              );
                            }}
                            className="board-card-title"
                            textClassName="board-title"
                          />
                          {board.isGuest && <span className="guest-badge">Guest</span>}
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
