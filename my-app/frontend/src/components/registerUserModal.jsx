import { useState } from "react";

function RegisterUserdModal({ onClose }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!name || !email || !password) {          //add later 
    //   alert("Please fill in all fields");
    //   return;
    // }

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Registration failed");
      }

      alert("User registered successfully!");
      onClose();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Register New User</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
          />
          <input
            name="password"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterUserdModal;
