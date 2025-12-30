import { redirect } from 'react-router-dom';
import { API_URL } from '../../../config';
import { authStorage } from '../utils/storage';

export default async function loginAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');
  const remember = formData.get('remember') === 'on';

  // Get the return URL from query params
  const url = new URL(request.url);
  const returnUrl = url.searchParams.get('returnUrl') || '/';

  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    // Return error data for the form to display
    return { error: data.error, field: data.field };
  }

  // Store token and user data with remember me preference
  authStorage.setToken(data.token, remember);
  authStorage.setUser(JSON.stringify(data.user), remember);

  // Redirect to return URL or root route on success
  return redirect(returnUrl);
}
