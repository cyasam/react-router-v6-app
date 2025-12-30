import { redirect, type ActionFunctionArgs } from 'react-router-dom';
import { apiDelete } from '../../../utils/api';

export async function action({ request, params }: ActionFunctionArgs) {
  // Only allow DELETE or POST requests, not GET (prevents URL paste)
  if (request.method !== 'POST' && request.method !== 'DELETE') {
    throw new Response('Method Not Allowed', { status: 405 });
  }

  const contactId = params.contactId;

  // Validate contact ID format
  if (!contactId || !/^[a-zA-Z0-9]+$/.test(contactId)) {
    throw new Response('Invalid contact ID', { status: 400 });
  }

  const response = await apiDelete(`/api/contacts/${contactId}`);

  if (!response.ok) {
    throw new Response('Contact not found', { status: 404 });
  }

  return redirect('/contacts');
}
