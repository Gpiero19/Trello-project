import { useEffect, useState } from "react";
import { createBoard, getBoards } from "../api/boards";
import { getUsers } from "../api/users";

function CreateBoardModal({ setBoards, onClose }) {
  const [title, setTitle] = useState("");
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !title) {
      alert("Please fill in both fields");
      return;
    }

    try {
      await createBoard(title, Number(userId));
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
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} (ID: {user.id})
              </option>
            ))}
          </select>
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  );
}

export default CreateBoardModal;
