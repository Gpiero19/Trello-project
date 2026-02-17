import { useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function CreateListModal({ onClose, refreshBoard }) {
  const {boardId} = useParams()
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await axiosInstance.post("/lists", { title, boardId });
      await refreshBoard();
      onClose();
    } catch (err) {
      console.error("Error creating list:", err);
      alert("Error: " + (err.response?.data?.error || err.message));
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
