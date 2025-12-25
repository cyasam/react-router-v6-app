import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    // Router error response (404, etc.)
    errorMessage =
      error.statusText || error.data?.message || `Error ${error.status}`;
  } else if (error instanceof Error) {
    // JavaScript Error (including fetch errors)
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'Unknown error occurred';
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-white dark:bg-slate-900">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Oops!
        </h1>
        <p className="text-xl text-slate-700 dark:text-slate-300 mb-4">
          Sorry, an unexpected error has occurred.
        </p>
        <p className="text-lg text-slate-600 dark:text-slate-400 italic">
          {errorMessage}
        </p>
        <a
          href="/"
          className="mt-8 inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors no-underline"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
}
