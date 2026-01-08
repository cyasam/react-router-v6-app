import { useRouteLoaderData, useNavigate, useFetcher } from 'react-router-dom';
import { useState } from 'react';

export default function EditContact() {
  const { contact } = useRouteLoaderData('contact');
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === 'submitting';
  const [errors, setErrors] = useState<{ first?: string; last?: string }>({});

  const validateForm = (formData: FormData) => {
    const newErrors: { first?: string; last?: string } = {};
    const first = formData.get('first') as string;
    const last = formData.get('last') as string;

    if (!first?.trim()) {
      newErrors.first = 'First name is required';
    }
    if (!last?.trim()) {
      newErrors.last = 'Last name is required';
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const newErrors = validateForm(formData);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      e.preventDefault();
    } else {
      setErrors({});
    }
  };

  return (
    <fetcher.Form
      method="post"
      onSubmit={handleSubmit}
      noValidate
      className="max-w-2xl mx-auto space-y-6"
    >
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        Edit Contact
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
              defaultValue={contact?.first}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.first
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-slate-300 dark:border-slate-600'
              } bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              required
            />
            {errors.first && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.first}
              </p>
            )}
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
              defaultValue={contact?.last}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.last
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-slate-300 dark:border-slate-600'
              } bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              required
            />
            {errors.last && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.last}
              </p>
            )}
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
            defaultValue={contact?.twitter}
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
            defaultValue={contact?.avatar}
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
            defaultValue={contact?.address}
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
            defaultValue={contact?.notes}
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
          {isSubmitting ? 'Saving...' : 'Save'}
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
