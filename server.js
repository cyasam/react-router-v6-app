import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// In-memory database
let contacts = [];
let nextId = 1;

// In-memory users database (for demo purposes only)
const users = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123', // In production, use hashed passwords!
    name: 'Admin User',
    role: 'admin',
    createdAt: Date.now(),
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'password123',
    name: 'Demo User',
    role: 'user',
    createdAt: Date.now(),
  },
  {
    id: '3',
    email: 'guest@example.com',
    password: 'guest123',
    name: 'Guest User',
    role: 'guest',
    createdAt: Date.now(),
  },
];

// Helper function to find contact by ID
const findContact = (id) => contacts.find(contact => contact.id === id);

// Helper function to generate fake network delay
const fakeNetwork = () => new Promise(resolve => setTimeout(resolve, Math.random() * 800));

// Helper function to validate authorization and get current user
const validateAuth = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {
    // Decode simple token (in production, use JWT verification)
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');

    const user = users.find(u => u.id === userId);
    return user || null;
  } catch (error) {
    return null;
  }
};

// ===== API Routes =====

// POST /api/auth/login - Login with credentials
app.post('/api/auth/login', async (req, res) => {
  await fakeNetwork();

  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required',
      field: !email ? 'email' : 'password'
    });
  }

  // Find user by email
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({
      error: 'Invalid email or password',
      field: 'email'
    });
  }

  // Check password (in production, use bcrypt.compare)
  if (user.password !== password) {
    return res.status(401).json({
      error: 'Invalid email or password',
      field: 'password'
    });
  }

  // Generate a simple token (in production, use JWT)
  const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

  // Return user info without password
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    success: true,
    token,
    user: userWithoutPassword,
    message: 'Login successful',
  });
});

// POST /api/auth/logout - Logout
app.post('/api/auth/logout', async (req, res) => {
  await fakeNetwork();

  const currentUser = validateAuth(req);

  if (!currentUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.json({
    success: true,
    message: 'Logout successful',
  });
});

// GET /api/auth/me - Get current user (with token validation)
app.get('/api/auth/me', async (req, res) => {
  await fakeNetwork();

  const currentUser = validateAuth(req);

  if (!currentUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { password: _, ...userWithoutPassword } = currentUser;

  res.json({
    success: true,
    user: userWithoutPassword,
  });
});

// ===== User Routes =====

// GET /api/users - Get all users (filtered by role)
app.get('/api/users', async (req, res) => {
  await fakeNetwork();

  const currentUser = validateAuth(req);

  if (!currentUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  let filteredUsers = [...users];

  // Non-admin users cannot see admin users
  if (currentUser.role !== 'admin') {
    filteredUsers = users.filter(u => u.role !== 'admin');
  }

  // Remove passwords from response
  const sanitizedUsers = filteredUsers.map(({ password, ...user }) => user);

  res.json(sanitizedUsers);
});

// GET /api/users/:id - Get a specific user by ID
app.get('/api/users/:id', async (req, res) => {
  await fakeNetwork();

  const currentUser = validateAuth(req);

  if (!currentUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Missing user ID' });
  }

  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Non-admin users cannot see admin users
  if (user.role === 'admin' && currentUser.role !== 'admin') {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// ===== Contact Routes =====

// GET /api/contacts - Get all contacts (with optional search query)
app.get('/api/contacts', async (req, res) => {
  await fakeNetwork();

  const currentUser = validateAuth(req);

  if (!currentUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const query = req.query.q || '';
  let filteredContacts = [...contacts];

  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredContacts = contacts.filter(contact => {
      const first = (contact.first || '').toLowerCase();
      const last = (contact.last || '').toLowerCase();
      return first.includes(lowerQuery) || last.includes(lowerQuery);
    });
  }

  // Sort by last name, then by createdAt
  filteredContacts.sort((a, b) => {
    if (a.last && b.last) {
      const lastCompare = a.last.localeCompare(b.last);
      if (lastCompare !== 0) return lastCompare;
    }
    return a.createdAt - b.createdAt;
  });

  res.json(filteredContacts);
});

// POST /api/contacts - Create a new contact
app.post('/api/contacts', async (req, res) => {
  await fakeNetwork();

  const currentUser = validateAuth(req);

  if (!currentUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Only admins can create contacts
  if (currentUser.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Only admins can create contacts' });
  }

  if (!req.body) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const newContact = {
    id: String(nextId++),
    first: req.body.first || '',
    last: req.body.last || '',
    avatar: req.body.avatar || '',
    twitter: req.body.twitter || '',
    notes: req.body.notes || '',
    favorite: req.body.favorite || false,
    createdAt: Date.now(),
  };

  contacts.unshift(newContact);
  res.status(201).json(newContact);
});

// GET /api/contacts/:id - Get a specific contact by ID
app.get('/api/contacts/:id', async (req, res) => {
  await fakeNetwork();

  const currentUser = validateAuth(req);

  if (!currentUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Missing contact ID' });
  }

  const contact = findContact(id);

  if (!contact) {
    return res.status(404).json({ error: 'Contact not found' });
  }

  res.json(contact);
});

// PUT /api/contacts/:id - Update a specific contact
app.put('/api/contacts/:id', async (req, res) => {
  await fakeNetwork();

  const currentUser = validateAuth(req);

  if (!currentUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Only admins can edit contacts
  if (currentUser.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Only admins can edit contacts' });
  }

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Missing contact ID' });
  }

  if (!req.body) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const contact = findContact(id);

  if (!contact) {
    return res.status(404).json({ error: 'Contact not found' });
  }

  // Update contact properties
  Object.assign(contact, req.body);

  res.json(contact);
});

// DELETE /api/contacts/:id - Delete a specific contact
app.delete('/api/contacts/:id', async (req, res) => {
  await fakeNetwork();

  const currentUser = validateAuth(req);

  if (!currentUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Only admins can delete contacts
  if (currentUser.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Only admins can delete contacts' });
  }

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Missing contact ID' });
  }

  const index = contacts.findIndex(contact => contact.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Contact not found' });
  }

  contacts.splice(index, 1);
  res.json({ success: true });
});

// Initialize with some sample data




// Catch-all route: serve React app for all non-API routes (must be last)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`\nAvailable routes:`);
  console.log(`\n  Authentication:`);
  console.log(`  POST   /api/auth/login        - Login with credentials`);
  console.log(`  POST   /api/auth/logout       - Logout`);
  console.log(`  GET    /api/auth/me           - Get current user`);
  console.log(`\n  Users:`);
  console.log(`  GET    /api/users             - Get all users`);
  console.log(`  GET    /api/users/:id         - Get a specific user`);
  console.log(`\n  Contacts:`);
  console.log(`  GET    /api/contacts          - Get all contacts`);
  console.log(`  POST   /api/contacts          - Create a new contact`);
  console.log(`  GET    /api/contacts/:id      - Get a specific contact`);
  console.log(`  PUT    /api/contacts/:id      - Update a specific contact`);
  console.log(`  DELETE /api/contacts/:id      - Delete a specific contact`);
  console.log(`\n  Demo Credentials:`);
  console.log(`  Email: admin@example.com  | Password: admin123    | Role: admin`);
  console.log(`  Email: user@example.com   | Password: password123 | Role: user`);
  console.log(`  Email: guest@example.com  | Password: guest123    | Role: guest`);
});
