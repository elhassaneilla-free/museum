const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'victoria_db',
  password: 'admin',
  port: 5432,
});

// For Academic Use: Mock users
const MOCK_USERS = [
  { id: 1, username: 'user', password: 'user123', role: 'user' },
  { id: 2, username: 'admin', password: 'admin123', role: 'admin' },
  { id: 3, username: 'Victoria', password: 'victoria123', role: 'user' }
];

console.log('--- RESTORING AUTHENTICATION SYSTEM ---');
console.log('Authorized Mock Users:');
MOCK_USERS.forEach(u => console.log(` - ${u.username} [${u.role}]`));

// Login Endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const normalizedUsername = username.trim().toLowerCase();
  const normalizedPassword = password.trim(); // Trim password for ease of use in academic demo

  console.log(`\n[LOGIN ATTEMPT] User: "${normalizedUsername}"`);

  // 1. Check Mock Data
  const mockUser = MOCK_USERS.find(u => 
    u.username.toLowerCase() === normalizedUsername && 
    u.password === normalizedPassword
  );

  if (mockUser) {
    console.log(`[SUCCESS] Found internal record for ${mockUser.username}`);
    return res.json({
      username: mockUser.username,
      role: mockUser.role
    });
  }

  // 2. DB Fallback
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE LOWER(username) = $1 AND password = $2',
      [normalizedUsername, normalizedPassword]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log(`[SUCCESS] Found database record for ${user.username}`);
      return res.json({
        username: user.username,
        role: user.role
      });
    }
  } catch (err) {
    console.warn(`[DB WARNING] Database query failed: ${err.message}. Proceeding with internal check only.`);
  }

  console.log(`[FAILED] No match found for "${normalizedUsername}"`);
  return res.status(401).json({ message: 'Invalid credentials' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'operational', timestamp: new Date().toISOString() });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`\nVICTORIA API actively monitoring port ${port}`);
  console.log(`Local Access: http://127.0.0.1:${port}`);
  console.log(`Network Access: http://localhost:${port}`);
});
