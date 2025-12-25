// Layout
export { default as ContactsLayout } from './layout';

// Routes
export { default as ContactRoute } from './routes/contact';
export { default as ContactListRoute } from './routes/list';
export { default as EditRoute } from './routes/edit';
export { default as NewRoute } from './routes/new';

// Loaders
export { loader as contactsLoader } from './loaders/contacts';
export { loader as contactLoader } from './loaders/contact';

// Actions
export { action as createContactAction } from './actions/create-contact';
export { action as deleteContactAction } from './actions/delete-contact';
export { action as updateContactAction } from './actions/update-contact';
export { action as updateFavoriteAction } from './actions/update-favorite';

// Types
export type { ContactRecord } from './types/contacts';
