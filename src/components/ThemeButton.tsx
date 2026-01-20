import useTheme from '../hooks/useTheme';

export default function ThemeButton() {
  const { isDark, setIsDark } = useTheme();

  const handleToggle = () => {
    const newValue = !isDark;
    setIsDark(newValue);
  };

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10">
      <button
        onClick={handleToggle}
        type="button"
        aria-label="Toggle dark mode"
        className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-full w-12 h-12 text-2xl cursor-pointer flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110 hover:shadow-lg active:scale-95"
      >
        {isDark ? '🌞' : '🌙'}
      </button>
    </div>
  );
}
