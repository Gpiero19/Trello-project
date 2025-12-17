import { useState } from "react";
import { useParams } from "react-router-dom";

function CreateListModal({ onClose, refreshBoard }) {
  const {boardId} = useParams()
  const [form, setForm] = useState({ title: "", boardId });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Registration failed");
      }

      await refreshBoard();

      onClose();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Create New List</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
          />
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default CreateListModal;
