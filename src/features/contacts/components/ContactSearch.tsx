import { Form, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import type { ContactRecord } from '../types/contacts';
import { matchSorter } from 'match-sorter';

interface ContactSearchProps {
  contacts: ContactRecord[];
}

export default function ContactSearch({ contacts }: ContactSearchProps) {
  const [searchValue, setSearchValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredContacts = useMemo(() => {
    if (!searchValue) return contacts;
    return matchSorter(contacts, searchValue, {
      keys: ['first', 'last', 'twitter'],
    });
  }, [contacts, searchValue]);

  return (
    <Form
      id="search-form"
      className="mb-8"
      role="search"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="relative">
        <input
          id="q"
          aria-label="Search contacts"
          placeholder="Search contacts..."
          type="search"
          name="q"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.currentTarget.value);

            if (e.currentTarget.value.length < 3) {
              setShowSuggestions(false);
              return;
            }
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(searchValue.length >= 3)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="w-full px-4 py-2 pl-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {showSuggestions && filteredContacts.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-80 overflow-y-auto">
            {filteredContacts.slice(0, 5).map((contact: ContactRecord) => (
              <Link
                key={contact.id}
                to={`/contacts/${contact.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-200 dark:border-slate-700 last:border-b-0"
                onClick={() => setShowSuggestions(false)}
              >
                <img
                  src={
                    contact.avatar ||
                    `https://robohash.org/${contact.id}.png?size=200x200`
                  }
                  alt=""
                  className="w-15 h-15 rounded-full object-cover bg-slate-200 dark:bg-slate-700"
                />

                <div className="flex-1">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <span className="italic text-slate-400 dark:text-slate-500">
                        No Name
                      </span>
                    )}
                  </div>
                  {contact.twitter && (
                    <div className="text-sm text-blue-500 dark:text-blue-400 mt-0.5">
                      @{contact.twitter}
                    </div>
                  )}
                </div>
                <svg
                  className="w-5 h-5 text-slate-400 dark:text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="sr-only" aria-live="polite"></div>
    </Form>
  );
}
