export default function MainPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Welcome to React Router Contacts
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
          This is a demo application showcasing React Router v7 with dark mode
          support.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="https://reactrouter.com"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors no-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Documentation
          </a>
        </div>
      </div>
    </div>
  );
}
