import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppStore } from '@/store/useAppStore';

export function useTheme() {
  const systemScheme = useColorScheme();
  const themeMode = useAppStore((s) => s.themeMode);

  let activeScheme: 'light' | 'dark' = 'light';

  if (themeMode === 'system') {
    activeScheme = systemScheme === 'dark' ? 'dark' : 'light';
  } else {
    activeScheme = themeMode;
  }

  return Colors[activeScheme];
}

export function useThemeMode() {
  const themeMode = useAppStore((s) => s.themeMode);
  const setThemeMode = useAppStore((s) => s.setThemeMode);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const systemScheme = useColorScheme();

  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';

  return {
    themeMode,
    setThemeMode,
    toggleTheme,
    isDark,
  };
}
