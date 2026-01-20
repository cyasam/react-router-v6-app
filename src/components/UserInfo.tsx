import { Form, useLoaderData } from 'react-router-dom';
import { authStorage } from '../features/auth';
import type { User } from '../features/users/types';

export default function UserInfo() {
  const user = useLoaderData() as User;

  const handleLogout = () => {
    authStorage.clear();
  };

  return (
    <div className="flex ml-auto">
      <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-sm font-medium">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.email}
            </p>
          </div>
        </div>
        <div className="ml-5">
          <Form method="post" action="/auth/logout" onSubmit={handleLogout}>
            <button
              type="submit"
              className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors no-underline cursor-pointer"
            >
              Logout
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
