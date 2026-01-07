import { redirect } from 'react-router-dom';
import { authStorage } from '../utils/storage';
import { apiPost } from '../../../utils/api';

export default async function loginAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');
  const remember = formData.get('remember') === 'on';

  // Get the return URL from query params
  const url = new URL(request.url);
  const returnUrl = url.searchParams.get('returnUrl') || '/';

  const response = await apiPost(`/api/auth/login`, {
    email,
    password,
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
