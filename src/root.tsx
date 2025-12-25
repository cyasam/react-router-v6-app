import { Outlet, useNavigation } from 'react-router-dom';
import NavigationProgress from './components/NavigationProgress';
import Sidebar from './components/Sidebar';
import Breadcrumb from './components/Breadcrumb';

export default function Root() {
  const navigation = useNavigation();

  return (
    <div className="flex h-screen w-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      <NavigationProgress />
      <Sidebar />
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
  );
}
