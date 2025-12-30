import { type LoaderFunctionArgs } from 'react-router-dom';
import { apiGet } from '../../../utils/api';

export async function loader({ params }: LoaderFunctionArgs) {
  const contactId = params.contactId;

  // Validate contact ID format (basic alphanumeric check)
  if (!contactId || !/^[a-zA-Z0-9]+$/.test(contactId)) {
    throw new Response('Invalid contact ID', { status: 400 });
  }

  const response = await apiGet(`/api/contacts/${contactId}`);
  if (!response.ok) {
    throw new Response('Failed to fetch contact', { status: response.status });
  }
  const contact = await response.json();

  if (!contact) {
    throw new Response('', {
      status: 404,
      statusText: 'Not Found',
    });
  }
  return { contact };
}
