import SidebarLink from './SidebarLink';
import type { UserWithoutPassword } from '../features/users/types';
import ThemeButton from './ThemeButton';

const navLinks = [
  { to: '/', name: 'Dashboard' },
  { to: '/contacts', name: 'Contacts' },
  { to: '/users', name: 'Users', roles: ['admin', 'user'] },
];

interface SidebarProps {
  user: UserWithoutPassword;
}

export default function Sidebar({ user }: SidebarProps) {
  return (
    <div className="w-88 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col relative transition-colors">
      <div className="px-8 py-4 flex justify-center">
        <h1 className="flex items-center text-xl font-medium m-0 leading-none text-slate-900 dark:text-slate-100">
          <span className="mr-2">🚀</span>
          React Router Contacts
        </h1>
      </div>

      <nav role="navigation" className="flex-1 overflow-auto px-8 pt-4">
        <ul className="p-0 m-0 list-none">
          {navLinks
            .filter((link) => !link.roles || link.roles.includes(user.role))
            .map((link) => (
              <li className="my-1" key={link.to}>
                <SidebarLink to={link.to} name={link.name} />
              </li>
            ))}
        </ul>
      </nav>

      <ThemeButton />
    </div>
  );
}
