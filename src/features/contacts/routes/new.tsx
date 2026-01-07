import { useFetcher, useNavigate } from 'react-router-dom';

export default function NewContact() {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === 'submitting';

  return (
    <fetcher.Form method="post" className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        New Contact
      </h1>

      {fetcher.state === 'idle' && fetcher.data?.message && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200">
          {fetcher.data.message}
        </div>
      )}

      {fetcher.state === 'idle' && fetcher.data?.error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
          {fetcher.data.error}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label
              htmlFor="first-name"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              First Name
            </label>
            <input
              id="first-name"
              placeholder="First"
              aria-label="First name"
              type="text"
              name="first"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="last-name"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Last Name
            </label>
            <input
              id="last-name"
              placeholder="Last"
              aria-label="Last name"
              type="text"
              name="last"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="twitter"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Twitter
          </label>
          <input
            id="twitter"
            type="text"
            name="twitter"
            placeholder="@jack"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="avatar"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Avatar URL
          </label>
          <input
            id="avatar"
            placeholder="https://example.com/avatar.jpg"
            aria-label="Avatar URL"
            type="text"
            name="avatar"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Address
          </label>
          <textarea
            id="address"
            name="address"
            placeholder="Street address, city, state, zip"
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={6}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
          {isSubmitting ? 'Creating...' : 'Create'}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={isSubmitting}
          className="px-6 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 dark:text-slate-100 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </fetcher.Form>
  );
}
