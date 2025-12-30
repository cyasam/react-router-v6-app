import { useLoaderData, Link } from 'react-router-dom';
import type { UserLoaderData } from '../loaders/user';

export default function UserRoute() {
  const { user } = useLoaderData() as UserLoaderData;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-purple-900 to-blue-900 px-6 py-8">
          <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
          <p className="text-gray-300">{user.email}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  User ID
                </label>
                <p className="text-lg text-gray-100">{user.id}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email Address
                </label>
                <p className="text-lg text-gray-100">{user.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Role
                </label>
                <span
                  className={
                    user.role === 'admin'
                      ? 'inline-block px-3 py-1 text-sm font-semibold rounded-full bg-purple-900 text-purple-200'
                      : user.role === 'user'
                      ? 'inline-block px-3 py-1 text-sm font-semibold rounded-full bg-blue-900 text-blue-200'
                      : 'inline-block px-3 py-1 text-sm font-semibold rounded-full bg-gray-600 text-gray-200'
                  }
                >
                  {user.role}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Member Since
                </label>
                <p className="text-lg text-gray-100">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-gray-700">
            <Link
              to="/users"
              className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              ← Back to Users
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
