const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Connection
// Note: In a real environment, use environment variables for credentials
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'victoria_db',
  password: 'admin',
  port: 5432,
});

// For Academic Use: Fallback mockup data if DB connection fails or is not setup
const MOCK_USERS = [
  { id: 1, username: 'user', password: 'qwerty', role: 'user' },
  { id: 2, username: 'admin', password: 'azerty', role: 'admin' }
];

// Login Endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt for: [${username}] with password: [${password}]`);

  // 1. Check Mock Data First (for academic convenience)
  const mockUser = MOCK_USERS.find(u => u.username === username && u.password === password);
  if (mockUser) {
    console.log(`Mock user found: ${mockUser.username} (${mockUser.role})`);
    return res.json({
      username: mockUser.username,
      role: mockUser.role
    });
  }

  // 2. Fallback to real DB if needed
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log(`DB user found: ${user.username} (${user.role})`);
      return res.json({
        username: user.username,
        role: user.role
      });
    }
  } catch (err) {
    console.error('DB Error:', err.message);
  }

  console.log('Login failed: Invalid credentials');
  return res.status(401).json({ message: 'Invalid credentials' });
});

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'operational' });
});

app.listen(port, '127.0.0.1', () => {
  console.log(`Victoria API listening at http://127.0.0.1:${port}`);
});
