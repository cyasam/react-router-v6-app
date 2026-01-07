import { redirect, type ActionFunctionArgs } from 'react-router-dom';
import type { ContactRecord } from '../types/contacts';
import { store } from '../../../store';
import contactsApi from '../reducers/api';

function sanitizeInput(value: unknown): string {
  if (!value || typeof value !== 'string') return '';
  return value.trim().slice(0, 500); // Limit length
}

function sanitizeTwitterHandle(value: unknown): string {
  if (!value || typeof value !== 'string') return '';
  // Remove @ if present and only keep alphanumeric and underscore
  return value
    .replace(/^@/, '')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .slice(0, 15);
}

function sanitizeAddress(value: unknown): string {
  if (!value || typeof value !== 'string') return '';
  // Preserve international characters, common punctuation, and formatting
  // Remove only potentially dangerous characters while keeping address-valid ones
  return value
    .trim()
    .replace(/[<>{}[\]\\]/g, '') // Remove potentially dangerous characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .slice(0, 1000); // Allow longer length for international addresses
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function action({ request }: ActionFunctionArgs) {
  // Only allow POST requests, not GET (prevents URL paste)
  if (request.method !== 'POST') {
    throw new Response('Method Not Allowed', { status: 405 });
  }

  const formData = await request.formData();
  const rawData = Object.fromEntries(formData);

  // Sanitize and validate inputs
  const newContactBody: Partial<ContactRecord> = {
    first: sanitizeInput(rawData.first),
    last: sanitizeInput(rawData.last),
    twitter: sanitizeTwitterHandle(rawData.twitter),
    address: sanitizeAddress(rawData.address),
    notes: sanitizeInput(rawData.notes),
    favorite: false,
  };

  // Validate avatar URL
  if (rawData.avatar && typeof rawData.avatar === 'string') {
    const avatarUrl = rawData.avatar.trim();
    if (avatarUrl && isValidUrl(avatarUrl)) {
      newContactBody.avatar = avatarUrl.slice(0, 1000);
    }
  }

  try {
    const newContact = await store
      .dispatch(contactsApi.endpoints.createContact.initiate(newContactBody))
      .unwrap();

    return redirect(`/contacts/${newContact.id}`);
  } catch (error: unknown) {
    // Handle RTK Query errors - return instead of throw
    const err = error as { status?: number };
    if (err.status === 409) {
      return { error: 'Contact already exists' };
    }
    if (err.status === 400) {
      return { error: 'Invalid contact data' };
    }
    return {
      error: `Failed to create contact (${err.status || 'Unknown error'})`,
    };
  }
}
