const express = require('express');
const pool = require('./db');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Get all notes for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    const result = await pool.query('SELECT * FROM notes WHERE user_id = $1 ORDER BY updated_at DESC', [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new note
router.post('/', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
      [userId, title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a note
router.put('/:id', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const noteId = req.params.id;
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      'UPDATE notes SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING *',
      [title, content, noteId, userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Note not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a note
router.delete('/:id', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const noteId = req.params.id;
  try {
    const result = await pool.query(
      'DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *',
      [noteId, userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 