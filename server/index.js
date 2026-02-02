const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
const port = 3000;
const SECRET_KEY = 'victoria_secret_vault';

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// --- MIDDLEWARE ---

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Insufficient privileges' });
  }
  next();
};

// --- AUTH ENDPOINTS ---

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (user && bcrypt.compareSync(password, user.password)) {
    if (user.status === 'disabled') {
      return res.status(403).json({ message: 'Account is disabled' });
    }
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ token, username: user.username, role: user.role });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// --- PAINTINGS ENDPOINTS ---

app.get('/api/paintings', (req, res) => {
  const paintings = db.prepare('SELECT * FROM paintings').all();
  res.json(paintings);
});

app.post('/api/paintings', authenticate, authorize(['admin']), (req, res) => {
  const { title, artist, description, price, image, category, availability } = req.body;
  const info = db.prepare(`
    INSERT INTO paintings (title, artist, description, price, image, category, availability)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(title, artist, description, price, image, category, availability ?? 1);
  res.status(201).json({ id: info.lastInsertRowid, ...req.body });
});

app.put('/api/paintings/:id', authenticate, authorize(['admin']), (req, res) => {
  const { title, artist, description, price, image, category, availability } = req.body;
  db.prepare(`
    UPDATE paintings 
    SET title = ?, artist = ?, description = ?, price = ?, image = ?, category = ?, availability = ?
    WHERE id = ?
  `).run(title, artist, description, price, image, category, availability, req.params.id);
  res.json({ message: 'Painting updated' });
});

app.delete('/api/paintings/:id', authenticate, authorize(['admin']), (req, res) => {
  db.prepare('DELETE FROM paintings WHERE id = ?').run(req.params.id);
  res.json({ message: 'Painting deleted' });
});

// --- USERS ENDPOINTS ---

app.get('/api/users', authenticate, authorize(['admin']), (req, res) => {
  const users = db.prepare('SELECT id, username, role, status FROM users').all();
  res.json(users);
});

app.post('/api/users', authenticate, authorize(['admin']), (req, res) => {
  const { username, password, role, status } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    const info = db.prepare('INSERT INTO users (username, password, role, status) VALUES (?, ?, ?, ?)').run(username, hashedPassword, role, status);
    res.status(201).json({ id: info.lastInsertRowid, username, role, status });
  } catch (err) {
    res.status(400).json({ message: 'Username already exists' });
  }
});

app.put('/api/users/:id', authenticate, authorize(['admin']), (req, res) => {
  const { username, role, status, password } = req.body;
  if (password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.prepare('UPDATE users SET username = ?, role = ?, status = ?, password = ? WHERE id = ?').run(username, role, status, hashedPassword, req.params.id);
  } else {
    db.prepare('UPDATE users SET username = ?, role = ?, status = ? WHERE id = ?').run(username, role, status, req.params.id);
  }
  res.json({ message: 'User updated' });
});

app.delete('/api/users/:id', authenticate, authorize(['admin']), (req, res) => {
  if (parseInt(req.params.id) === req.user.id) {
    return res.status(400).json({ message: 'Cannot delete yourself' });
  }
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ message: 'User deleted' });
});

// --- ORDERS ENDPOINTS ---

app.get('/api/orders', authenticate, (req, res) => {
  let orders;
  if (req.user.role === 'admin') {
    orders = db.prepare(`
      SELECT o.*, u.username as user 
      FROM orders o 
      LEFT JOIN users u ON o.userId = u.id
    `).all();
  } else {
    orders = db.prepare('SELECT * FROM orders WHERE userId = ?').all(req.user.id);
  }

  // Fetch items for each order
  const ordersWithItems = orders.map(order => {
    const items = db.prepare('SELECT * FROM order_items WHERE orderId = ?').all(order.id);
    return { ...order, items };
  });

  res.json(ordersWithItems);
});

app.post('/api/orders', authenticate, (req, res) => {
  const { items, total } = req.body;
  const date = new Date().toISOString();
  
  const insertOrder = db.transaction(() => {
    const info = db.prepare('INSERT INTO orders (userId, total, status, date) VALUES (?, ?, ?, ?)').run(req.user.id, total, 'pending', date);
    const orderId = info.lastInsertRowid;
    
    const insertItem = db.prepare(`
      INSERT INTO order_items (orderId, productTitle, artist, variant, price, image, quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    for (const item of items) {
      insertItem.run(orderId, item.name, item.artist, item.variant, item.price, item.image, item.quantity);
    }
    
    return orderId;
  });

  const orderId = insertOrder();
  res.status(201).json({ id: orderId, message: 'Order placed successfully' });
});

app.put('/api/orders/:id/status', authenticate, authorize(['admin']), (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ message: 'Order status updated' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'operational', timestamp: new Date().toISOString() });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`\nVICTORIA API actively monitoring port ${port}`);
  console.log(`Local Access: http://127.0.0.1:${port}`);
});
