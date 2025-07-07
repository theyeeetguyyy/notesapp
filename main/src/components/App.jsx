import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function App() {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Helper to get token
  const getToken = () => localStorage.getItem("token");

  // Fetch notes on mount
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
    axios.get("/api/notes", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setNotes(res.data))
      .catch(err => {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Failed to fetch notes");
        }
      });
  }, [navigate]);

  // Add note
  function addNote(newNote) {
    setError("");
    const token = getToken();
    axios.post("/api/notes", newNote, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setNotes(prev => [res.data, ...prev]))
      .catch(() => setError("Failed to add note"));
  }

  // Delete note
  function deleteNote(id) {
    setError("");
    const token = getToken();
    axios.delete(`/api/notes/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => setNotes(prev => prev.filter(note => note.id !== id)))
      .catch(() => setError("Failed to delete note"));
  }

  // Logout
  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div>
      <Header />
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
      <CreateArea onAdd={addNote} />
      {error && <p className="error">{error}</p>}
      {notes.map((noteItem) => (
        <Note
          key={noteItem.id}
          id={noteItem.id}
          title={noteItem.title}
          content={noteItem.content}
          onDelete={deleteNote}
        />
      ))}
      {/* <Footer /> */}
    </div>
  );
}

export default App;
