import { type ActionFunctionArgs } from 'react-router-dom';
import { API_URL } from '../../../config';
import { store } from '../../../store';
import contactsApi from '../reducers/api';
import { safeGetToken } from '../../../utils/api';

export async function action({ request, params }: ActionFunctionArgs) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return { error: 'Method Not Allowed' };
  }

  const contactId = params.contactId;

  if (!contactId || !/^[a-zA-Z0-9]+$/.test(contactId)) {
    return { error: 'Invalid contact ID' };
  }

  const formData = await request.formData();
  const favorite = formData.get('favorite') === 'true';

  const token = safeGetToken();

  try {
    const res = await fetch(`${API_URL}/api/contacts/${contactId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ favorite }),
    });

    if (!res.ok) {
      throw { status: res.status };
    }

    const result = await res.json();

    store.dispatch(contactsApi.util.invalidateTags(['Contacts']));

    return result;
  } catch (error) {
    const err = error as { status?: number };
    if (err.status === 404) {
      return { error: 'Contact not found' };
    }
    return {
      error: `Failed to update favorite (${err.status || 'Unknown error'})`,
    };
  }
}
