import localforage from 'localforage';
import type { User, UserWithoutPassword } from '../features/users/types';

// Initialize users in localforage
const initializeUsers = async () => {
  let users = await localforage.getItem<User[]>('users');
  if (!users || users.length === 0) {
    users = [
      {
        id: '1',
        email: 'admin@example.com',
        password: 'admin123',
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
    await localforage.setItem('users', users);
  }
  return users;
};

// Get all users
export async function getUsers(): Promise<User[]> {
  return await initializeUsers();
}

// Find user by email
export async function findUserByEmail(email: string): Promise<User | null> {
  const users = await getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  return user || null;
}

// Find user by ID
export async function findUserById(id: string): Promise<User | null> {
  const users = await getUsers();
  const user = users.find((u) => u.id === id);
  return user || null;
}

// Validate credentials
export async function validateCredentials(
  email: string,
  password: string
): Promise<User | null> {
  const user = await findUserByEmail(email);
  if (!user || user.password !== password) {
    return null;
  }
  return user;
}

// Remove password from user object
export function sanitizeUser(user: User): UserWithoutPassword {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Generate token (simple base64 encoding for demo)
export function generateToken(userId: string): string {
  return btoa(`${userId}:${Date.now()}`);
}

// Validate and decode token
export function decodeToken(token: string): string | null {
  try {
    const decoded = atob(token);
    const [userId] = decoded.split(':');
    return userId;
  } catch {
    return null;
  }
}
