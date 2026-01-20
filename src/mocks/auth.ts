import localforage from 'localforage';
import type { User, UserWithoutPassword } from '../features/users/types';

// Initialize users in localforage
const initializeUsers = async () => {
  let users = await localforage.getItem<UserWithoutPassword[]>('users');
  if (!users || users.length === 0) {
    users = [
      {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        createdAt: Date.now(),
      },
      {
        id: '2',
        email: 'user@example.com',
        name: 'Demo User',
        role: 'user',
        createdAt: Date.now(),
      },
      {
        id: '3',
        email: 'guest@example.com',
        name: 'Guest User',
        role: 'guest',
        createdAt: Date.now(),
      },
    ];
  }
  return users;
};

// Get all users
export async function getUsers(): Promise<UserWithoutPassword[]> {
  return await initializeUsers();
}

// Find user by email
export async function findUserByEmail(
  email: string,
): Promise<UserWithoutPassword | null> {
  const users = await getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  return user || null;
}

// Find user by ID
export async function findUserById(
  id: string,
): Promise<UserWithoutPassword | null> {
  const users = await getUsers();
  const user = users.find((u) => u.id === id);
  return user || null;
}

// Validate credentials
export async function validateCredentials(
  email: string,
  password: string,
): Promise<UserWithoutPassword | null> {
  // Hardcoded credentials for dev (passwords not stored in IndexedDB)
  const devCredentials: Record<string, string> = {
    'admin@example.com': 'admin123',
    'user@example.com': 'password123',
    'guest@example.com': 'guest123',
  };

  const user = await findUserByEmail(email);
  if (!user || devCredentials[email.toLowerCase()] !== password) {
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
