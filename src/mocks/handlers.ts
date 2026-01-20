import { http, HttpResponse } from 'msw';
import {
  createContact,
  deleteContact,
  getContact,
  getContacts,
  updateContact,
} from './contacts';
import {
  validateCredentials,
  sanitizeUser,
  generateToken,
  decodeToken,
  findUserById,
  getUsers,
} from './auth';
import type { ContactRecord } from '../features/contacts';
import type { User } from '../features/users/types';

// Helper function to validate authorization and get current user
async function validateAuth(request: Request): Promise<User | null> {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  const userId = decodeToken(token);

  if (!userId) {
    return null;
  }

  const user = await findUserById(userId);
  return user;
}

export const handlers = [
  // ===== Authentication Routes =====
  http.post('http://localhost:5000/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return HttpResponse.json(
        {
          error: 'Email and password are required',
          field: !email ? 'email' : 'password',
        },
        { status: 400 },
      );
    }

    // Validate credentials
    const user = await validateCredentials(email, password);

    if (!user) {
      return HttpResponse.json(
        {
          error: 'Invalid email or password',
          field: 'email',
        },
        { status: 401 },
      );
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user without password
    const userWithoutPassword = sanitizeUser(user);

    return HttpResponse.json({
      success: true,
      token,
      user: userWithoutPassword,
      message: 'Login successful',
    });
  }),

  http.post('http://localhost:5000/api/auth/logout', async ({ request }) => {
    const user = await validateAuth(request);

    if (!user) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json({
      success: true,
      message: 'Logout successful',
    });
  }),

  http.get('http://localhost:5000/api/auth/me', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 },
      );
    }

    const token = authHeader.split(' ')[1];
    const userId = decodeToken(token);

    if (!userId) {
      return HttpResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await findUserById(userId);

    if (!user) {
      return HttpResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userWithoutPassword = sanitizeUser(user);

    return HttpResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  }),

  // ===== User Routes =====
  http.get('http://localhost:5000/api/users', async ({ request }) => {
    const currentUser = await validateAuth(request);

    if (!currentUser) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await getUsers();
    let filteredUsers = users;

    // Non-admin users cannot see admin users
    if (currentUser.role !== 'admin') {
      filteredUsers = users.filter((u) => u.role !== 'admin');
    }

    const sanitizedUsers = filteredUsers.map(sanitizeUser);
    return HttpResponse.json(sanitizedUsers);
  }),

  http.get(
    'http://localhost:5000/api/users/:id',
    async ({ request, params }) => {
      const currentUser = await validateAuth(request);

      if (!currentUser) {
        return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const userId = params.id;

      if (!userId || typeof userId !== 'string') {
        return HttpResponse.json({ error: 'Missing user ID' }, { status: 400 });
      }

      const user = await findUserById(userId);

      if (!user) {
        return HttpResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Non-admin users cannot see admin users
      if (user.role === 'admin' && currentUser.role !== 'admin') {
        return HttpResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const sanitizedUser = sanitizeUser(user);
      return HttpResponse.json(sanitizedUser);
    },
  ),

  // ===== Contact Routes =====
  http.get('http://localhost:5000/api/contacts', async ({ request }) => {
    const currentUser = await validateAuth(request);

    if (!currentUser) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contacts = await getContacts('');

    return HttpResponse.json(contacts);
  }),
  http.post('http://localhost:5000/api/contacts', async ({ request }) => {
    const currentUser = await validateAuth(request);

    if (!currentUser) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can create contacts
    if (currentUser.role !== 'admin') {
      return HttpResponse.json(
        { error: 'Forbidden: Only admins can create contacts' },
        { status: 403 },
      );
    }

    const body = await request.json();
    if (!body) {
      return HttpResponse.json(
        { error: 'Invalid request body' },
        { status: 400 },
      );
    }

    const contact = await createContact({
      ...(body as Partial<ContactRecord>),
      createdBy: currentUser.id,
      createdByName: currentUser.name,
    });
    return HttpResponse.json(contact, { status: 201 });
  }),
  http.get(
    'http://localhost:5000/api/contacts/:id',
    async ({ request, params }) => {
      const currentUser = await validateAuth(request);

      if (!currentUser) {
        return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const contactId = params.id;

      if (!contactId || typeof contactId !== 'string') {
        return HttpResponse.json(
          { error: 'Missing contact ID' },
          { status: 400 },
        );
      }

      const contact = await getContact(contactId);

      return HttpResponse.json(contact);
    },
  ),
  http.delete(
    'http://localhost:5000/api/contacts/:id',
    async ({ request, params }) => {
      const currentUser = await validateAuth(request);

      if (!currentUser) {
        return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Only admins can delete contacts
      if (currentUser.role !== 'admin') {
        return HttpResponse.json(
          { error: 'Forbidden: Only admins can delete contacts' },
          { status: 403 },
        );
      }

      const contactId = params.id;

      if (!contactId || typeof contactId !== 'string') {
        return HttpResponse.json(
          { error: 'Missing contact ID' },
          { status: 400 },
        );
      }

      const success = await deleteContact(contactId);

      if (!success) {
        return HttpResponse.json(
          { error: 'Contact not found' },
          { status: 404 },
        );
      }

      return HttpResponse.json({ success: true }, { status: 200 });
    },
  ),
  http.put(
    'http://localhost:5000/api/contacts/:id',
    async ({ request, params }) => {
      const currentUser = await validateAuth(request);

      if (!currentUser) {
        return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Only admins can edit contacts
      if (currentUser.role !== 'admin') {
        return HttpResponse.json(
          { error: 'Forbidden: Only admins can edit contacts' },
          { status: 403 },
        );
      }

      const contactId = params.id;

      if (!contactId || typeof contactId !== 'string') {
        return HttpResponse.json(
          { error: 'Missing contact ID' },
          { status: 400 },
        );
      }

      const body = await request.json();
      if (!body) {
        return HttpResponse.json(
          { error: 'Invalid request body' },
          { status: 400 },
        );
      }

      const contact = await updateContact(
        contactId,
        body as Partial<ContactRecord>,
      );
      return HttpResponse.json(contact, { status: 200 });
    },
  ),
];
