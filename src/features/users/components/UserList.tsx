import { useNavigate } from 'react-router-dom';
import type { UserWithoutPassword } from '../types';

interface UserListProps {
  users: UserWithoutPassword[];
}

export default function UserList({ users }: UserListProps) {
  const navigate = useNavigate();

  const handleRowClick = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
        <thead>
          <tr className="bg-gray-900 border-b border-gray-700">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Created At
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                onClick={() => handleRowClick(user.id)}
                className="hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={
                      user.role === 'admin'
                        ? 'px-2 py-1 text-xs font-semibold rounded-full bg-purple-900 text-purple-200'
                        : user.role === 'user'
                        ? 'px-2 py-1 text-xs font-semibold rounded-full bg-blue-900 text-blue-200'
                        : 'px-2 py-1 text-xs font-semibold rounded-full bg-gray-600 text-gray-200'
                    }
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
