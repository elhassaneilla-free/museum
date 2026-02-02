const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'victoria.db');
const db = new Database(dbPath);

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'user')) DEFAULT 'user',
    status TEXT CHECK(status IN ('active', 'disabled')) DEFAULT 'active'
  );

  CREATE TABLE IF NOT EXISTS paintings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    description TEXT,
    price TEXT NOT NULL,
    image TEXT NOT NULL,
    availability INTEGER DEFAULT 1,
    category TEXT,
    layout TEXT CHECK(layout IN ('portrait', 'landscape')) DEFAULT 'portrait'
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    total REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    date TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER NOT NULL,
    productTitle TEXT NOT NULL,
    artist TEXT NOT NULL,
    variant TEXT NOT NULL,
    price TEXT NOT NULL,
    image TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
  );
`);

// Seed Initial Data if empty
const userCount = db.prepare('SELECT count(*) as count FROM users').get().count;
if (userCount === 0) {
  const adminPassword = bcrypt.hashSync('admin123', 10);
  const userPassword = bcrypt.hashSync('victoria123', 10);
  
  db.prepare('INSERT INTO users (username, password, role, status) VALUES (?, ?, ?, ?)').run('admin', adminPassword, 'admin', 'active');
  db.prepare('INSERT INTO users (username, password, role, status) VALUES (?, ?, ?, ?)').run('Victoria', userPassword, 'user', 'active');
  db.prepare('INSERT INTO users (username, password, role, status) VALUES (?, ?, ?, ?)').run('user', bcrypt.hashSync('user123', 10), 'user', 'active');
  
  console.log('Database seeded with initial users.');
}

const paintingCount = db.prepare('SELECT count(*) as count FROM paintings').get().count;
if (paintingCount === 0) {
  const paintings = [
    // Leonardo
    { title: 'Mona Lisa', artist: 'Leonardo da Vinci', description: 'The portrait of Lisa Gherardini, a masterpiece of Renaissance art.', price: 'Priceless', image: 'assets/leo1.jpg', category: 'Renaissance' },
    { title: 'Vitruvian Man', artist: 'Leonardo da Vinci', description: 'Exploring the proportions of the human body and celestial geometry.', price: '€2,500,000', image: 'assets/leo2.jpg', category: 'Renaissance' },
    { title: 'Annunciation', artist: 'Leonardo da Vinci', description: 'A timeless depiction of the angel Gabriel and the Virgin Mary.', price: '€85,000,000', image: 'assets/leo3.jpg', category: 'Renaissance' },
    { title: 'Lady with an Ermine', artist: 'Leonardo da Vinci', description: 'A symbolic portrait capturing grace and intense focus.', price: '€95,000,000', image: 'assets/leo4.jpg', category: 'Renaissance' },
    // Picasso
    { title: 'Guernica', artist: 'Pablo Picasso', description: 'An anti-war masterpiece depicting the tragedy of conflict.', price: '€200,000,000', image: 'assets/picasso1.jpg', category: 'Modern' },
    { title: 'The Old Guitarist', artist: 'Pablo Picasso', description: 'A poignant study of exhaustion and sorrow from the Blue Period.', price: '€150,000,000', image: 'assets/picasso2.jpg', category: 'Modern' },
    { title: 'Dove of Peace', artist: 'Pablo Picasso', description: 'A universal symbol of hope and tranquility.', price: '€110,000,000', image: 'assets/picasso3.jpg', category: 'Modern' },
    { title: 'Portrait of Dora Maar', artist: 'Pablo Picasso', description: 'A distortion of reality through the lens of cubism.', price: '€140,000,000', image: 'assets/picasso4.jpg', category: 'Modern' },
    // Van Gogh
    { title: 'The Starry Night', artist: 'Vincent van Gogh', description: 'A swirling dream of the night sky over Saint-Rémy.', price: '€350,000,000', image: 'assets/van1.jpg', category: 'Post-Impressionism', layout: 'landscape' },
    { title: 'Irises', artist: 'Vincent van Gogh', description: 'Vibrant flowers captured with emotional intensity.', price: '€180,000,000', image: 'assets/van2.jpg', category: 'Post-Impressionism' },
    { title: 'Van Gogh Self-Portrait', artist: 'Vincent van Gogh', description: 'An introspective gaze into the artist\'s soul.', price: '€220,000,000', image: 'assets/van3.jpg', category: 'Post-Impressionism' },
    { title: 'The Potato Eaters', artist: 'Vincent van Gogh', description: 'A somber depiction of peasant life and labor.', price: '€90,000,000', image: 'assets/van4.jpg', category: 'Post-Impressionism' },
    // Vermeer
    { title: 'Girl with a Pearl Earring', artist: 'Johannes Vermeer', description: 'The "Mona Lisa of the North", a study of light and form.', price: '€160,000,000', image: 'assets/vermeer1.jpg', category: 'Dutch Golden Age' },
    { title: 'The Art of Painting', artist: 'Johannes Vermeer', description: 'An allegorical celebration of the artist\'s craft.', price: '€130,000,000', image: 'assets/vermeer2.jpg', category: 'Dutch Golden Age' },
    { title: 'The Milkmaid', artist: 'Johannes Vermeer', description: 'A serene moment of domesticity captured in perfect light.', price: '€115,000,000', image: 'assets/vermeer3.jpg', category: 'Dutch Golden Age' },
    { title: 'View of Delft', artist: 'Johannes Vermeer', description: 'A masterful cityscape shimmering with morning light.', price: '€145,000,000', image: 'assets/vermeer4.jpg', category: 'Dutch Golden Age', layout: 'landscape' },
    // Monet
    { title: 'Impression, Sunrise', artist: 'Claude Monet', description: 'The painting that gave birth to the Impressionist movement.', price: '€175,000,000', image: 'assets/mon1.jpg', category: 'Impressionism', layout: 'landscape' },
    { title: 'Woman with a Parasol', artist: 'Claude Monet', description: 'A fleeting moment of light and shadow in a summer field.', price: '€125,000,000', image: 'assets/mon2.jpg', category: 'Impressionism' },
    { title: 'The Water Lily Pond', artist: 'Claude Monet', description: 'A meditative study of nature at Giverny.', price: '€190,000,000', image: 'assets/mon3.jpg', category: 'Impressionism', layout: 'landscape' },
    { title: 'San Giorgio Maggiore at Dusk', artist: 'Claude Monet', description: 'The ethereal light of Venice captured in oil.', price: '€140,000,000', image: 'assets/mon4.jpg', category: 'Impressionism', layout: 'landscape' },
    // Hopper
    { title: 'Nighthawks', artist: 'Edward Hopper', description: 'An iconic depiction of urban loneliness and light.', price: '€250,000,000', image: 'assets/hop1.jpg', category: 'Realism', layout: 'landscape' },
    { title: 'Automat', artist: 'Edward Hopper', description: 'A solitary figure in a brightly lit café.', price: '€110,000,000', image: 'assets/hop2.jpg', category: 'Realism', layout: 'landscape' },
    { title: 'Chop Suey', artist: 'Edward Hopper', description: 'Two women in a restaurant, a study of social interaction.', price: '€130,000,000', image: 'assets/hop3.jpg', category: 'Realism', layout: 'landscape' },
    { title: 'Rooms by the Sea', artist: 'Edward Hopper', description: 'The boundary between interior space and the vast ocean.', price: '€120,000,000', image: 'assets/hop4.jpg', category: 'Realism', layout: 'landscape' },
    // Frames
    { title: 'Bronze Classic Frame', artist: 'Luxury Collection', description: 'A timeless bronze frame inspired by classical European museums, offering warmth and historical elegance.', price: '€450', image: 'assets/frame1.png', category: 'Frames' },
    { title: 'Silver Heritage Frame', artist: 'Luxury Collection', description: 'A refined silver frame with subtle reflections, perfect for modern and impressionist masterpieces.', price: '€750', image: 'assets/frame2.png', category: 'Frames' },
    { title: 'Imperial Gold Frame', artist: 'Luxury Collection', description: 'An opulent gold frame crafted to elevate masterpieces, inspired by royal and museum collections.', price: '€1,200', image: 'assets/frame3.png', category: 'Frames' }
  ];

  const insert = db.prepare('INSERT INTO paintings (title, artist, description, price, image, category, layout) VALUES (?, ?, ?, ?, ?, ?, ?)');
  for (const p of paintings) {
    insert.run(p.title, p.artist, p.description, p.price, p.image, p.category, p.layout || 'portrait');
  }
  console.log('Database seeded with paintings.');
}

module.exports = db;
