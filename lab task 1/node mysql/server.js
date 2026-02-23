const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// CREATE - Add new user
app.post('/users', async (req, res) => {
  try {
    const { user_id, email, phone } = req.body;
    const [result] = await db.execute(
      'INSERT INTO users (user_id, email, phone) VALUES (?, ?, ?)',
      [user_id, email, phone]
    );
    res.status(201).json({ id: result.insertId, user_id, email, phone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// READ (All)
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// READ (Single)
app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// UPDATE
app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, email, phone } = req.body;
    const [result] = await db.execute(
      'UPDATE users SET user_id = ?, email = ?, phone = ? WHERE id = ?',
      [user_id, email, phone, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ id: Number(id), user_id, email, phone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Start server with automatic fallback if port is in use
const BASE_PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
let _attempts = 0;
const MAX_ATTEMPTS = 10;

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      _attempts += 1;
      if (_attempts >= MAX_ATTEMPTS) {
        console.error(`Port ${port} in use and max attempts reached. Exiting.`);
        process.exit(1);
      }
      const next = port + 1;
      console.warn(`Port ${port} in use, trying port ${next}...`);
      setTimeout(() => startServer(next), 200);
    } else {
      console.error(err);
      process.exit(1);
    }
  });
}

startServer(BASE_PORT);
