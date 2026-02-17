import { useState } from "react";
import { createBoard } from "../api/boards";

function CreateBoardModal({ setBoards: refreshBoards, onClose }) {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createBoard(title);
      await refreshBoards();
      setTitle("");
      onClose();
      
    } catch (err) {
      console.error("Error creating board:", err);
      alert("Failed to create board. Try again.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Create New Board</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Board title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  );
}

export default CreateBoardModal;
