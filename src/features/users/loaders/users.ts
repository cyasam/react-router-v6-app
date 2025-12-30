import type { LoaderFunctionArgs } from 'react-router-dom';
import type { UserWithoutPassword } from '../types';
import { apiGet } from '../../../utils/api';

export interface UsersLoaderData {
  users: UserWithoutPassword[];
}

export async function usersLoader({
  request,
}: LoaderFunctionArgs): Promise<UsersLoaderData> {
  const response = await apiGet('/api/users', { signal: request.signal });

  if (!response.ok) {
    throw new Response('Failed to fetch users', { status: response.status });
  }

  const users = await response.json();

  return { users };
}
