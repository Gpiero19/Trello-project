import { useState } from "react";
import { createBoard } from "../api/boards";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/authContext";
import { saveGuestBoard, generateGuestId } from "../api/guestStorage";
import Modal from "./ui/Modal";
import Button from "./ui/Button";

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
    <Modal onClose={onClose}>
      <h2>Create New Board</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Board title"
          aria-label="Board title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          type="text"
          placeholder="Description (optional)"
          aria-label="Board description (optional)"
          value={description}
          maxLength={500}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <div className="modal-actions">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateBoardModal;
