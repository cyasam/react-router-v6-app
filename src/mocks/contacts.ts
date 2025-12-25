import localforage from 'localforage';
import { matchSorter } from 'match-sorter';
import sortBy from 'sort-by';
import type { ContactRecord } from '../features/contacts/types/contacts';

export async function getContacts(query: string): Promise<ContactRecord[]> {
  await fakeNetwork(`getContacts:${query}`);
  let contacts = await localforage.getItem<ContactRecord[]>('contacts');
  if (!contacts) contacts = [];
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ['first', 'last'] });
  }
  return contacts.sort(sortBy('last', 'createdAt'));
}

export async function createContact(newContact: Partial<ContactRecord>) {
  await fakeNetwork('');
  const id = Math.random().toString(36).substring(2, 9);
  const contact: ContactRecord = { id, createdAt: Date.now(), ...newContact };
  const contacts = await getContacts('');
  contacts.unshift(contact);
  await set(contacts);
  return contact;
}

export async function getContact(id: string) {
  await fakeNetwork(`contact:${id}`);
  const contacts = await localforage.getItem<ContactRecord[]>('contacts');
  const contact = contacts?.find((contact) => contact.id === id);
  return contact ?? null;
}

export async function updateContact(
  id: string,
  updates: Partial<ContactRecord>
) {
  await fakeNetwork('');
  const contacts = await localforage.getItem<ContactRecord[]>('contacts');
  const contact = contacts?.find((contact) => contact.id === id);
  if (!contact) throw new Error('No contact found for ' + id);
  Object.assign(contact, updates);
  if (contacts) await set(contacts);
  return contact;
}

export async function deleteContact(id: string) {
  const contacts = await localforage.getItem<ContactRecord[]>('contacts');
  const index = contacts?.findIndex((contact) => contact.id === id) ?? -1;
  if (index > -1 && contacts) {
    contacts.splice(index, 1);
    await set(contacts);
    return true;
  }
  return false;
}

function set(contacts: ContactRecord[]) {
  return localforage.setItem('contacts', contacts);
}

// fake a cache so we don't slow down stuff we've already seen
const fakeCache: Record<string, boolean> = {};

async function fakeNetwork(key: string) {
  if (!key) {
    Object.keys(fakeCache).forEach((k) => delete fakeCache[k]);
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;
  return new Promise<void>((res) => {
    setTimeout(res, Math.random() * 800);
  });
}
