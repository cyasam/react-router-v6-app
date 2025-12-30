// Storage utility to handle remember me functionality

type StorageType = 'local' | 'session';

class AuthStorage {
  private storageType: StorageType = 'local';

  // Set storage type based on remember me preference
  setStorageType(remember: boolean) {
    this.storageType = remember ? 'local' : 'session';
  }

  // Get the appropriate storage
  private getStorage(): Storage {
    return this.storageType === 'local' ? localStorage : sessionStorage;
  }

  // Get token from either storage
  getToken(): string | null {
    return (
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
    );
  }

  // Set token in appropriate storage
  setToken(token: string, remember: boolean) {
    this.setStorageType(remember);
    const storage = this.getStorage();
    storage.setItem('authToken', token);

    // Clear from other storage
    const otherStorage = remember ? sessionStorage : localStorage;
    otherStorage.removeItem('authToken');
  }

  // Get user from either storage
  getUser(): string | null {
    return localStorage.getItem('user') || sessionStorage.getItem('user');
  }

  // Set user in appropriate storage
  setUser(user: string, remember: boolean) {
    this.setStorageType(remember);
    const storage = this.getStorage();
    storage.setItem('user', user);

    // Clear from other storage
    const otherStorage = remember ? sessionStorage : localStorage;
    otherStorage.removeItem('user');
  }

  // Clear all auth data
  clear() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
  }
}

export const authStorage = new AuthStorage();
