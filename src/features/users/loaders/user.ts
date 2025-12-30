import type { LoaderFunctionArgs } from 'react-router-dom';
import type { UserWithoutPassword } from '../types';
import { apiGet } from '../../../utils/api';

export interface UserLoaderData {
  user: UserWithoutPassword;
}

export async function userLoader({
  params,
  request,
}: LoaderFunctionArgs): Promise<UserLoaderData> {
  const { userId } = params;

  if (!userId) {
    throw new Response('User ID is required', { status: 400 });
  }

  const response = await apiGet(`/api/users/${userId}`, {
    signal: request.signal,
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Response('User not found', { status: 404 });
    }
    throw new Response('Failed to fetch user', { status: response.status });
  }

  const user = await response.json();

  return { user };
}
