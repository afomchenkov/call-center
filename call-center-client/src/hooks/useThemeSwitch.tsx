import { useEffect, useState } from 'react';
import type { Dispatch } from 'react';

const THEME_KEY = 'call_center_main:theme';

type UseThemeSwitch = () => [activeTheme: string, setTheme: Dispatch<string>];

export const useThemeSwitch: UseThemeSwitch = () => {
  // TODO: fix it
  const [theme, setTheme] = useState(localStorage.theme || 'light');
  const activeTheme = theme === 'dark' ? 'light' : 'dark';

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove(activeTheme);
    root.classList.add(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme, activeTheme]);

  return [activeTheme, setTheme];
};
