import { apiGet } from '../../../utils/api';

export async function loader() {
  const response = await apiGet('/api/contacts');
  if (!response.ok) {
    throw new Response('Failed to fetch contacts', { status: response.status });
  }
  const contacts = await response.json();
  return { contacts };
}
