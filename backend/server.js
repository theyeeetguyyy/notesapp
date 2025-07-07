const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createTables } = require('./models');
const { router: authRouter } = require('./auth');
const notesRouter = require('./notes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://notesapp-nine-red.vercel.app',
  ],
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Note Taking App new Backend Running');
});

createTables();
app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
