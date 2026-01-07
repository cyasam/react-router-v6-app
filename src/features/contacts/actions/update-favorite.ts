import { type ActionFunctionArgs } from 'react-router-dom';
import { store } from '../../../store';
import contactsApi from '../reducers/api';

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

  try {
    const result = await store
      .dispatch(
        contactsApi.endpoints.updateFavorite.initiate({
          id: contactId,
          favorite,
        })
      )
      .unwrap();

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
