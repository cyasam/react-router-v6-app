import { type ActionFunctionArgs } from 'react-router-dom';
import { API_URL } from '../../../config';

export async function action({ request, params }: ActionFunctionArgs) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    throw new Response('Method Not Allowed', { status: 405 });
  }

  const contactId = params.contactId;

  if (!contactId || !/^[a-zA-Z0-9]+$/.test(contactId)) {
    throw new Response('Invalid contact ID', { status: 400 });
  }

  const formData = await request.formData();
  const favorite = formData.get('favorite') === 'true';

  const response = await fetch(`${API_URL}/api/contacts/${contactId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ favorite }),
  });

  return response.json();
}
