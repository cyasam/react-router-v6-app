import { redirect } from 'react-router-dom';
import { API_URL } from '../../../config';
import { authStorage } from '../utils/storage';
import type { UserRole } from '../../users/types';

export interface RoleProtectedLoaderOptions {
  allowedRoles: UserRole[];
}

function redirectUrl(request: Request) {
  const url = new URL(request.url);
  const returnUrl = url.pathname + url.search;

  if (returnUrl === '/') {
    return redirect('/auth/login');
  }

  return redirect(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`);
}

export function createRoleProtectedLoader(allowedRoles: UserRole[]) {
  return async function roleProtectedLoader({ request }: { request: Request }) {
    // Check if user has a token
    const token = authStorage.getToken();

    if (!token) {
      // Store the current URL to redirect back after login
      return redirectUrl(request);
    }

    try {
      // Verify token with the API
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Token is invalid, clear it and redirect to login with return URL
        authStorage.clear();
        return redirectUrl(request);
      }

      const data = await response.json();
      const user = data.user;

      // Check if user has the required role
      if (!allowedRoles.includes(user.role)) {
        // User doesn't have permission, redirect to home
        throw new Response('Unauthorized', {
          status: 403,
          statusText: 'You do not have permission to access this page',
        });
      }

      // Return user data to be available via useLoaderData
      return user;
    } catch (error) {
      if (error instanceof Response) {
        throw error;
      }
      // Network error or other issue, redirect to login with return URL
      authStorage.clear();
      console.error('Error verifying token:', error);
      return redirectUrl(request);
    }
  };
}

// Pre-configured loaders for common role combinations
export const adminOnlyLoader = createRoleProtectedLoader(['admin']);
export const adminAndUserLoader = createRoleProtectedLoader(['admin', 'user']);
export const allRolesLoader = createRoleProtectedLoader([
  'admin',
  'user',
  'guest',
]);
