import { Form, useRouteLoaderData, useNavigate } from 'react-router-dom';

export default function EditContact() {
  const { contact } = useRouteLoaderData('contact');
  const navigate = useNavigate();

  return (
    <Form method="post" className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        Edit Contact
      </h1>

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
              defaultValue={contact?.last}
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
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </Form>
  );
}
