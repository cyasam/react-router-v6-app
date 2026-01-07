import { redirect, type ActionFunctionArgs } from 'react-router-dom';
import { store } from '../../../store';
import contactsApi from '../reducers/api';

export async function action({ request, params }: ActionFunctionArgs) {
  // Only allow DELETE or POST requests, not GET (prevents URL paste)
  if (request.method !== 'POST' && request.method !== 'DELETE') {
    return { error: 'Method Not Allowed' };
  }

  const contactId = params.contactId;

  // Validate contact ID format
  if (!contactId || !/^[a-zA-Z0-9]+$/.test(contactId)) {
    return { error: 'Invalid contact ID' };
  }

  try {
    await store
      .dispatch(contactsApi.endpoints.deleteContact.initiate(contactId))
      .unwrap();

    return redirect('/contacts');
  } catch (error) {
    const err = error as { status?: number };
    if (err.status === 404) {
      return { error: 'Contact not found' };
    }
    return {
      error: `Failed to delete contact (${err.status || 'Unknown error'})`,
    };
  }
}
