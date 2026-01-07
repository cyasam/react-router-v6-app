import { store } from '../../../store';
import { contactsApi } from '../reducers/api';

export async function loader() {
  const result = await store.dispatch(
    contactsApi.endpoints.getContacts.initiate()
  );

  return result;
}
