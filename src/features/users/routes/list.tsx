import { useLoaderData } from 'react-router-dom';
import type { UsersLoaderData } from '../loaders/users';
import UserList from '../components/UserList';

export default function UsersListRoute() {
  const { users } = useLoaderData() as UsersLoaderData;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
          Users
        </h2>
      </div>
      <UserList users={users} />
    </div>
  );
}
