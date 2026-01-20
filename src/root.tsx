import { Outlet, useNavigation, useLoaderData } from 'react-router-dom';
import NavigationProgress from './components/NavigationProgress';
import Sidebar from './components/Sidebar';
import Breadcrumb from './components/Breadcrumb';
import type { UserWithoutPassword } from './features/users/types';
import Header from './components/Header';
import useTitleUpdater from './hooks/useTitleUpdater';

export default function Root() {
  useTitleUpdater();
  const navigation = useNavigation();
  const user = useLoaderData() as UserWithoutPassword;

  return (
    <div className="flex h-screen w-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      <NavigationProgress />
      <Sidebar user={user} />
      <div className="container">
        <Header />
        <div
          role="main"
          className={`flex-1 p-8 w-full overflow-auto transition-opacity ${
            navigation.state === 'loading' ? 'opacity-25' : ''
          }`}
        >
          <Breadcrumb />
          <Outlet />
        </div>
      </div>
    </div>
  );
}
