import { redirect } from 'react-router-dom';
import { authStorage } from '../utils/storage';

export default async function logoutAction() {
  // Clear authentication data from both storages and IndexedDB
  await authStorage.clear();

  // Redirect to login page
  return redirect('/auth/login');
}
