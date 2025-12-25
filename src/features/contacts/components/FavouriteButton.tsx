import { useFetcher } from 'react-router-dom';
import type { ContactRecord } from '../types/contacts';

export default function FavoriteButton({
  contact,
}: {
  contact: ContactRecord;
}) {
  const fetcher = useFetcher();

  const favorite = fetcher.formData
    ? fetcher.formData.get('favorite') === 'true'
    : contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? 'false' : 'true'}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        className="text-3xl transition-all hover:scale-110 active:scale-95 border-none bg-transparent cursor-pointer p-0"
        style={{ color: favorite ? '#fbbf24' : '#d1d5db' }}
      >
        {favorite ? '★' : '☆'}
      </button>
    </fetcher.Form>
  );
}
