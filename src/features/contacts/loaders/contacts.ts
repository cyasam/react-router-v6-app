import { API_URL } from '../../../config';

export async function loader() {
  const response = await fetch(`${API_URL}/api/contacts`);
  if (!response.ok) {
    throw new Response('Failed to fetch contacts', { status: response.status });
  }
  const contacts = await response.json();
  return { contacts };
}
