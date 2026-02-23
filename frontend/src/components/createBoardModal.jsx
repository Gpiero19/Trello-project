import { useState } from "react";
import { createBoard } from "../api/boards";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/authContext";
import { saveGuestBoard, generateGuestId } from "../api/guestStorage";

function CreateBoardModal({ setBoards: refreshBoards, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { addToast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      if (!user) {
        // Guest mode - save to localStorage
        const newBoard = {
          id: generateGuestId(),
          title: title,
          description: description || null,
          Lists: []
        };
        await saveGuestBoard(newBoard);
        addToast("Board created successfully!", "success");
      } else {
        await createBoard(title, description || null);
        addToast("Board created successfully!", "success");
      }
      await refreshBoards();
      setTitle("");
      setDescription("");
      onClose();
      
    } catch (err) {
      console.error("Error creating board:", err);
      addToast("Failed to create board. Try again.", "error");
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
          <textarea
            type="text"
            placeholder="Description (optional)"
            value={description}
            maxLength={500}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  );
}

export default CreateBoardModal;
