import { Link, useLoaderData, useRouteLoaderData } from 'react-router-dom';
import ContactSearch from '../components/ContactSearch';
import type { UserWithoutPassword } from '../../users/types';
import type { ContactRecord } from '../types/contacts';

export default function ContactList() {
  const loaderData = useLoaderData();
  const user = useRouteLoaderData('root') as UserWithoutPassword;

  const contacts = loaderData?.data ?? [];

  return (
    <div className="p-8">
      <ContactSearch />
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 m-0">
          All Contacts
        </h2>
        {user.role === 'admin' && (
          <Link
            to="/contacts/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors no-underline"
          >
            New Contact
          </Link>
        )}
      </div>

      {contacts?.length ? (
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
          {contacts.map((contact: ContactRecord) => (
            <Link
              key={contact.id}
              to={`/contacts/${contact.id}`}
              className="no-underline border border-slate-200 dark:border-slate-700 rounded-lg p-6 flex gap-4 items-start transition-all bg-white dark:bg-slate-800 hover:border-blue-500 hover:shadow-lg hover:-translate-y-0.5"
            >
              <img
                src={
                  contact.avatar ||
                  `https://robohash.org/${contact.id}.png?size=200x200`
                }
                alt={`${contact.first} ${contact.last}`}
                className="w-15 h-15 rounded-full object-cover bg-slate-200 dark:bg-slate-700"
              />

              <div className="flex-1 min-w-0">
                <h3 className="m-0 mb-2 text-slate-900 dark:text-slate-100 text-xl font-semibold flex items-center gap-2">
                  {contact.first || contact.last ? (
                    <>
                      {contact.first} {contact.last}
                    </>
                  ) : (
                    <i className="text-slate-500 dark:text-slate-400 font-normal">
                      No Name
                    </i>
                  )}
                  {contact.favorite && (
                    <span className="text-amber-400 not-italic">★</span>
                  )}
                </h3>
                {contact.twitter && (
                  <p className="m-0 mb-1 text-blue-600 dark:text-blue-400 text-sm">
                    @{contact.twitter}
                  </p>
                )}
                {contact.notes && (
                  <p className="mt-2 mb-0 text-slate-600 dark:text-slate-400 text-sm overflow-hidden text-ellipsis line-clamp-2 leading-relaxed">
                    {contact.notes}
                  </p>
                )}
                {contact.createdBy && (
                  <p className="mt-2 mb-0 text-slate-500 dark:text-slate-500 text-xs">
                    Created by {contact.createdByName ?? contact.createdBy}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center p-16 text-slate-600 dark:text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <p className="text-xl text-slate-900 dark:text-slate-100">
            No contacts yet
          </p>
          {user.role === 'admin' && (
            <Link
              to="/contacts/new"
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors no-underline inline-block"
            >
              Create your first contact
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
