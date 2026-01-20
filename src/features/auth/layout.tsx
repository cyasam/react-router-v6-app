import { Outlet } from 'react-router-dom';
import ThemeButton from '../../components/ThemeButton';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-linear-to-br from-blue-200/20 to-transparent dark:from-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-linear-to-tl from-purple-200/20 to-transparent dark:from-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Auth Card Container */}
      <div className="relative w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 space-y-6 border border-slate-200 dark:border-slate-700">
          {/* Logo/Brand Section */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Welcome
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Sign in to continue to your account
            </p>
          </div>

          {/* Outlet for auth routes */}
          <Outlet />

          {/* Footer */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              By continuing, you agree to our{' '}
              <a
                href="#"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="#"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Additional footer info */}
        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
          © 2025 Your Company. All rights reserved.
        </p>
      </div>
      <ThemeButton />
    </div>
  );
}
