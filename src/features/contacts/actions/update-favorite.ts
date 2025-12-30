import { type ActionFunctionArgs } from 'react-router-dom';
import { apiPut } from '../../../utils/api';

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

  const response = await apiPut(`/api/contacts/${contactId}`, { favorite });

  return response.json();
}
