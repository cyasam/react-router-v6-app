import localforage from 'localforage';
import { matchSorter } from 'match-sorter';
import type { ContactRecord } from '../features/contacts/types/contacts';
import { getUsers } from './auth';

async function getCreatorNameMap(): Promise<Map<string, string>> {
  const users = await getUsers();
  const map = new Map<string, string>();

  users.forEach((user) => {
    map.set(user.id, user.name);
  });

  map.set('system', 'System');
  return map;
}

async function attachCreatorNames(
  contacts: ContactRecord[],
): Promise<ContactRecord[]> {
  if (!contacts.length) return contacts;

  const map = await getCreatorNameMap();

  return contacts.map((contact) => ({
    ...contact,
    createdByName:
      contact.createdByName ??
      (contact.createdBy
        ? (map.get(contact.createdBy) ?? contact.createdBy)
        : undefined),
  }));
}

async function attachCreatorName(
  contact: ContactRecord | null,
): Promise<ContactRecord | null> {
  if (!contact) return null;
  const [withName] = await attachCreatorNames([contact]);
  return withName;
}

function stripCreatorNames(contacts: ContactRecord[]): ContactRecord[] {
  return contacts.map(({ createdByName, ...rest }) => rest);
}

export async function getContacts(query: string): Promise<ContactRecord[]> {
  await fakeNetwork(`getContacts:${query}`);
  let contacts = await localforage.getItem<ContactRecord[]>('contacts');
  if (!contacts) contacts = [];
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ['first', 'last'] });
  }

  contacts.sort((a, b) => {
    const lastA = a.last ?? '';
    const lastB = b.last ?? '';
    const lastCompare = lastA.localeCompare(lastB, undefined, {
      sensitivity: 'base',
    });
    if (lastCompare !== 0) return lastCompare;

    const createdAtA = a.createdAt ?? 0;
    const createdAtB = b.createdAt ?? 0;
    return createdAtA - createdAtB;
  });

  return attachCreatorNames(contacts);
}

export async function createContact(newContact: Partial<ContactRecord>) {
  await fakeNetwork('');
  const id = Math.random().toString(36).substring(2, 9);
  const contact: ContactRecord = {
    ...newContact,
    id,
    createdAt: Date.now(),
    createdBy: newContact.createdBy ?? 'system',
  };
  const contacts = await getContacts('');
  contacts.unshift(contact);
  const withNames = await attachCreatorNames(contacts);
  await set(stripCreatorNames(withNames));
  return withNames[0];
}

export async function getContact(id: string) {
  await fakeNetwork(`contact:${id}`);
  const contacts = await localforage.getItem<ContactRecord[]>('contacts');
  const contact = contacts?.find((contact) => contact.id === id);
  return attachCreatorName(contact ?? null);
}

export async function updateContact(
  id: string,
  updates: Partial<ContactRecord>,
) {
  await fakeNetwork('');
  const contacts = await localforage.getItem<ContactRecord[]>('contacts');
  const contact = contacts?.find((contact) => contact.id === id);
  if (!contact) throw new Error('No contact found for ' + id);
  Object.assign(contact, updates);
  if (contacts) {
    const withNames = await attachCreatorNames(contacts);
    await set(stripCreatorNames(withNames));
    const updated = withNames.find((c) => c.id === id);
    return updated as ContactRecord;
  }
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
