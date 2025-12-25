import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from './error-page';

import {
  contactsLoader,
  contactLoader,
  createContactAction,
  deleteContactAction,
  updateContactAction,
  updateFavoriteAction,
  type ContactRecord,
} from './features/contacts';

export const router = createBrowserRouter([
  {
    path: '/',
    lazy: async () => {
      const { default: Root } = await import('./root');
      return { Component: Root };
    },
    handle: { breadcrumb: 'Home' },
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { MainRoute } = await import('./features/main');
          return { Component: MainRoute };
        },
        handle: { breadcrumb: 'Main' },
      },
      {
        path: 'contacts',
        lazy: async () => {
          const { ContactsLayout } = await import('./features/contacts');
          return { Component: ContactsLayout };
        },
        handle: { breadcrumb: 'Contacts' },
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            lazy: async () => {
              const { ContactListRoute } = await import('./features/contacts');
              return { Component: ContactListRoute };
            },
            loader: contactsLoader,
          },
          {
            path: 'new',
            lazy: async () => {
              const { NewRoute } = await import('./features/contacts');
              return { Component: NewRoute };
            },
            handle: { breadcrumb: 'New' },
            action: createContactAction,
          },
          {
            id: 'contact',
            path: ':contactId',
            handle: {
              breadcrumb: (data: { contact: ContactRecord }) => {
                const c = data.contact as { first: string; last: string };
                return `${c.first} ${c.last}`;
              },
            },
            loader: contactLoader,
            children: [
              {
                index: true,
                lazy: async () => {
                  const { ContactRoute } = await import('./features/contacts');
                  return { Component: ContactRoute };
                },
                action: updateFavoriteAction,
              },
              {
                path: 'edit',
                lazy: async () => {
                  const { EditRoute } = await import('./features/contacts');
                  return { Component: EditRoute };
                },
                handle: { breadcrumb: 'Edit' },
                loader: contactLoader,
                action: updateContactAction,
              },
              {
                path: 'destroy',
                action: deleteContactAction,
              },
            ],
          },
        ],
      },
    ],
  },
]);
