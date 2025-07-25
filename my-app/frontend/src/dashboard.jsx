import { useEffect, useState } from "react";
import { getBoards } from "./api/boards";
import CreateBoardModal from "./components/createBoardModal";

function Dashboard () {
    const [boards, setBoards] = useState([])
    const [NewBoardModal, setNewBoardModal] = useState(false);

    useEffect(() => {
    getBoards()
        .then(setBoards)
        .catch((err) => console.error("Error fetching boards:", err));
    }, []);

    
    return (
        <div style={{ padding: "1em" }}>

        <button onClick={() => setNewBoardModal(true)}>+ New Board</button>

        {/* Modal */}
        {NewBoardModal && (
            <CreateBoardModal
                setBoards={setBoards}
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
            <h3>{board.title}</h3>
            <p>User ID: {board.userId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard