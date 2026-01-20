import UserInfo from './UserInfo';

export default function Header() {
  return (
    <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex-col relative transition-colors">
      <UserInfo />
    </div>
  );
}
