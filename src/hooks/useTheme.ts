import { useEffect, useState } from 'react';

export default function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return (
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    } catch (error: unknown) {
      console.error('Theme detection error:', error);
      return false;
    }
  });

  useEffect(() => {
    try {
      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.warn('Failed to set theme:', error.message);
      }
    }
  }, [isDark]);

  return { isDark, setIsDark };
}
