import { useState } from "react";
import { createBoard, getBoards } from "../api/boards";

function CreateBoardModal({ setBoards, onClose }) {
  const [title, setTitle] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      alert("Please enter a board title");
      return;
    }

    try {
      await createBoard(title);
      const newBoards = await getBoards();
      setBoards(newBoards);
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
