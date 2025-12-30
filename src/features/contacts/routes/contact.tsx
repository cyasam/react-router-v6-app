import { Form, Link, useRouteLoaderData } from 'react-router-dom';
import FavoriteButton from '../components/FavouriteButton';
import Map from '../../../components/Map';
import type { UserWithoutPassword } from '../../users/types';

export default function Contact() {
  const { contact } = useRouteLoaderData('contact');
  const user = useRouteLoaderData('root') as UserWithoutPassword;

  return (
    <div className="max-w-4xl">
      <div className="flex gap-8 flex-col md:flex-row">
        <div className="shrink-0">
          <Link to="/contacts">
            <img
              key={contact.avatar}
              alt={
                `${contact.first || ''} ${contact.last || ''}`.trim() ||
                'Contact avatar'
              }
              src={
                contact.avatar ||
                `https://robohash.org/${contact.id}.png?size=200x200`
              }
              className="w-48 h-48 rounded-2xl object-cover bg-slate-200 dark:bg-slate-700 shadow-lg hover:shadow-xl transition-shadow"
            />
          </Link>
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2 flex-wrap">
            {contact.first || contact.last ? (
              <>
                {contact.first} {contact.last}
              </>
            ) : (
              <i className="text-slate-500 dark:text-slate-400">No Name</i>
            )}{' '}
            <FavoriteButton contact={contact} />
          </h1>

          {contact.twitter && (
            <p className="mb-4">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://twitter.com/${encodeURIComponent(
                  contact.twitter.replace(/[^a-zA-Z0-9_]/g, '')
                )}`}
                className="text-blue-600 dark:text-blue-400 hover:underline text-lg"
              >
                @{contact.twitter}
              </a>
            </p>
          )}

          {contact.address && (
            <div className="mb-4">
              <p className="text-slate-700 dark:text-slate-300 mb-2">
                <strong className="font-semibold">Address:</strong>{' '}
                {contact.address}
              </p>
              <Map key={contact.address} address={contact.address} />
            </div>
          )}

          {contact.notes && (
            <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap mb-6">
              {contact.notes}
            </p>
          )}

          {user?.role === 'admin' && (
            <div className="flex gap-3 flex-wrap">
              <Link
                to="edit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors no-underline"
              >
                Edit
              </Link>
              <Form
                method="post"
                action="destroy"
                onSubmit={(event) => {
                  if (
                    !confirm('Please confirm you want to delete this record.')
                  ) {
                    event.preventDefault();
                  }
                }}
              >
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Delete
                </button>
              </Form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
