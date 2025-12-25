import { http, HttpResponse } from 'msw';
import {
  createContact,
  deleteContact,
  getContact,
  getContacts,
  updateContact,
} from './contacts';
import type { ContactRecord } from '../features/contacts';

export const handlers = [
  http.get('http://localhost:5000/api/contacts', async () => {
    const contacts = await getContacts('');

    return HttpResponse.json(contacts);
  }),
  http.post('http://localhost:5000/api/contacts', async ({ request }) => {
    const body = await request.json();
    if (!body) {
      return HttpResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const contact = await createContact(body as Partial<ContactRecord>);
    return HttpResponse.json(contact, { status: 201 });
  }),
  http.get('http://localhost:5000/api/contacts/:id', async ({ params }) => {
    const contactId = params.id;

    if (!contactId || typeof contactId !== 'string') {
      return HttpResponse.json(
        { error: 'Missing contact ID' },
        { status: 400 }
      );
    }

    const contact = await getContact(contactId);

    return HttpResponse.json(contact);
  }),
  http.delete('http://localhost:5000/api/contacts/:id', async ({ params }) => {
    const contactId = params.id;

    if (!contactId || typeof contactId !== 'string') {
      return HttpResponse.json(
        { error: 'Missing contact ID' },
        { status: 400 }
      );
    }

    const success = await deleteContact(contactId);

    if (!success) {
      return HttpResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),
  http.put(
    'http://localhost:5000/api/contacts/:id',
    async ({ request, params }) => {
      const contactId = params.id;

      if (!contactId || typeof contactId !== 'string') {
        return HttpResponse.json(
          { error: 'Missing contact ID' },
          { status: 400 }
        );
      }

      const body = await request.json();
      if (!body) {
        return HttpResponse.json(
          { error: 'Invalid request body' },
          { status: 400 }
        );
      }

      const contact = await updateContact(
        contactId,
        body as Partial<ContactRecord>
      );
      return HttpResponse.json(contact, { status: 200 });
    }
  ),
];
