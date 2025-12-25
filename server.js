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

// Helper function to find contact by ID
const findContact = (id) => contacts.find(contact => contact.id === id);

// Helper function to generate fake network delay
const fakeNetwork = () => new Promise(resolve => setTimeout(resolve, Math.random() * 800));

// ===== API Routes =====

// GET /api/contacts - Get all contacts (with optional search query)
app.get('/api/contacts', async (req, res) => {
  await fakeNetwork();

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

// Catch-all route - serve index.html for all non-API routes
// This enables React Router to handle client-side routing
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Initialize with some sample data
const initializeData = () => {
  contacts = [
    {
      id: '1',
      first: 'John',
      last: 'Doe',
      avatar: 'https://i.pravatar.cc/150?img=1',
      twitter: '@johndoe',
      notes: 'Sample contact 1',
      favorite: false,
      createdAt: Date.now() - 1000000,
    },
    {
      id: '2',
      first: 'Jane',
      last: 'Smith',
      avatar: 'https://i.pravatar.cc/150?img=2',
      twitter: '@janesmith',
      notes: 'Sample contact 2',
      favorite: true,
      createdAt: Date.now() - 2000000,
    },
    {
      id: '3',
      first: 'Bob',
      last: 'Johnson',
      avatar: 'https://i.pravatar.cc/150?img=3',
      twitter: '@bobjohnson',
      notes: 'Sample contact 3',
      favorite: false,
      createdAt: Date.now() - 3000000,
    },
  ];
  nextId = 4;
};

// Catch-all route: serve React app for all non-API routes (must be last)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  initializeData();
  console.log(`🚀 Mock server is running on http://localhost:${PORT}`);
  console.log(`\nAvailable routes:`);
  console.log(`  GET    /api/contacts          - Get all contacts`);
  console.log(`  POST   /api/contacts          - Create a new contact`);
  console.log(`  GET    /api/contacts/:id      - Get a specific contact`);
  console.log(`  PUT    /api/contacts/:id      - Update a specific contact`);
  console.log(`  DELETE /api/contacts/:id      - Delete a specific contact`);
});
