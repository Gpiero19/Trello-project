import { useEffect, useState } from "react";
import { getBoards } from "./api/boards";
import CreateBoardModal from "./components/createBoardModal";
import { Link } from "react-router-dom";

function Dashboard () {
    const [boards, setBoard] = useState([])
    const [NewBoardModal, setNewBoardModal] = useState(false);

    useEffect(() => {
    getBoards()
        .then(setBoard)
        .catch((err) => console.error("Error fetching boards:", err));
    }, []);

    
    return (
        <div style={{ padding: "1em" }}>

        <button onClick={() => setNewBoardModal(true)}>+ New Board</button>

        {/* Modal */}
        {NewBoardModal && (
            <CreateBoardModal
                setBoards={setBoard}
                onClose={() => setNewBoardModal(false)}
                />
                )}
            {/* Board list */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1em", margin: "1em" }}>
        {boards.map((board) => (
          <div
            key={board.id}
            style={{
              border: "1px solid gray",
              borderRadius: "8px",
              padding: "1em",   
              minWidth: "clamp(200px, 300px, 100%)",
              backgroundColor: "white"
            }}
          >
            <Link to={`/boards/${board.id}`} style={{ color:"rgba(78, 31, 0, 0.87)"}}>
              <h3>{board.title}</h3>
              <p>User ID: {board.userId}</p>
              <p>Board ID: {board.id}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard