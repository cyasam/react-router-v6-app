import localforage from 'localforage';
import type { ContactRecord } from '../features/contacts/types/contacts';

const SCHEMA_VERSION_KEY = 'schemaVersion';
const INITIAL_VERSION = 1;
const CURRENT_VERSION = 2;

interface Migration {
  version: number;
  description: string;
  run: () => Promise<void>;
}

const migrations: Migration[] = [
  {
    version: 2,
    description: 'Add createdBy to contacts',
    run: async () => {
      const contacts =
        (await localforage.getItem<ContactRecord[]>('contacts')) ?? [];

      const migratedContacts = contacts.map((contact) => ({
        ...contact,
        createdBy: contact.createdBy ?? 'system',
      }));

      await localforage.setItem('contacts', migratedContacts);
    },
  },
];

export async function runMigrations(): Promise<number> {
  const storedVersion = await localforage.getItem<number>(SCHEMA_VERSION_KEY);
  let currentVersion = storedVersion ?? INITIAL_VERSION;

  // Apply all migrations that are newer than the current version
  const pendingMigrations = migrations
    .filter((migration) => migration.version > currentVersion)
    .sort((a, b) => a.version - b.version);

  for (const migration of pendingMigrations) {
    await migration.run();
    currentVersion = migration.version;
    await localforage.setItem(SCHEMA_VERSION_KEY, currentVersion);
  }

  currentVersion = Math.max(currentVersion, CURRENT_VERSION);
  await localforage.setItem(SCHEMA_VERSION_KEY, currentVersion);

  return currentVersion;
}
