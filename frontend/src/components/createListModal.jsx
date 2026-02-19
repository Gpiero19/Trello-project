import { useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useToast } from "../context/ToastContext";

function CreateListModal({ onClose, refreshBoard }) {
  const {boardId} = useParams()
  const [title, setTitle] = useState("");
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await axiosInstance.post("/lists", { title, boardId });
      await refreshBoard();
      onClose();
    } catch (err) {
      console.error("Error creating list:", err);
      addToast("Error: " + (err.response?.data?.error || err.message), "error");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Create New List</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="List title"
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

export default CreateListModal;
