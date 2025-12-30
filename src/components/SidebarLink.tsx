import { NavLink } from 'react-router-dom';

interface SidebarLinkProps {
  to: string;
  name: string;
}

export default function SidebarLink({ to, name }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive, isPending }) =>
        `flex items-center justify-between overflow-hidden whitespace-pre px-2 py-2 rounded-lg no-underline gap-4 font-semibold transition-all ${
          isActive
            ? 'bg-blue-600 dark:bg-blue-500 text-white dark:text-slate-900'
            : isPending
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`
      }
    >
      {name}
    </NavLink>
  );
}
