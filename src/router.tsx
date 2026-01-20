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
import {
  loginAction,
  logoutAction,
  allRolesLoader,
  adminAndUserLoader,
  adminOnlyLoader,
} from './features/auth';
import { usersLoader, userLoader } from './features/users';

export const router = createBrowserRouter([
  {
    id: 'root',
    path: '/',
    lazy: async () => {
      const { default: Root } = await import('./root');
      return { Component: Root };
    },
    loader: allRolesLoader,
    handle: { breadcrumb: 'Home' },
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { MainRoute } = await import('./features/main');
          return { Component: MainRoute };
        },
        handle: { title: 'Home', breadcrumb: 'Main' },
      },
      {
        path: 'contacts',
        lazy: async () => {
          const { ContactsLayout } = await import('./features/contacts');
          return { Component: ContactsLayout };
        },
        handle: { title: 'Contacts', breadcrumb: 'Contacts' },
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
            handle: { title: 'New Contact', breadcrumb: 'New' },
            loader: adminOnlyLoader,
            action: createContactAction,
          },
          {
            id: 'contact',
            path: ':contactId',
            handle: {
              title: (data: { contact: ContactRecord }) => {
                if (!data?.contact) {
                  return 'Contact';
                }
                const c = data.contact as { first: string; last: string };
                return `Contact: ${c.first} ${c.last}`;
              },
              breadcrumb: (data: { contact: ContactRecord }) => {
                if (!data?.contact) {
                  return;
                }
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
                handle: {
                  title: (data: { contact: ContactRecord }) => {
                    if (!data?.contact) {
                      return 'Edit Contact';
                    }
                    const c = data.contact as { first: string; last: string };
                    return `Edit Contact: ${c.first} ${c.last}`;
                  },
                  breadcrumb: 'Edit',
                },
                loader: adminOnlyLoader,
                action: updateContactAction,
              },
              {
                path: 'destroy',
                loader: adminOnlyLoader,
                action: deleteContactAction,
              },
            ],
          },
        ],
      },
      {
        path: 'users',
        lazy: async () => {
          const { UsersLayout } = await import('./features/users');
          return { Component: UsersLayout };
        },
        loader: adminAndUserLoader,
        errorElement: <ErrorPage />,
        handle: { title: 'Users', breadcrumb: 'Users' },
        children: [
          {
            index: true,
            lazy: async () => {
              const { UsersRoute } = await import('./features/users');
              return { Component: UsersRoute };
            },
            loader: usersLoader,
          },
          {
            path: ':userId',
            lazy: async () => {
              const { UserRoute } = await import('./features/users/');
              return { Component: UserRoute };
            },
            loader: userLoader,
            handle: {
              title: (data: { user?: { name: string } }) => {
                const userName = data?.user?.name;

                if (!userName) {
                  return 'User';
                }

                return `User: ${userName}`;
              },
              breadcrumb: (data: { user?: { name: string } }) => {
                return data?.user?.name || 'User';
              },
            },
          },
        ],
      },
    ],
  },
  {
    path: 'auth',
    lazy: async () => {
      const { AuthLayout } = await import('./features/auth');
      return { Component: AuthLayout };
    },
    errorElement: <ErrorPage />,
    children: [
      {
        id: 'login',
        path: 'login',
        lazy: async () => {
          const { LoginRoute } = await import('./features/auth');
          return { Component: LoginRoute };
        },
        handle: { title: 'Login' },
        action: loginAction,
      },
      {
        path: 'logout',
        action: logoutAction,
      },
    ],
  },
]);
