import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { RepositoryProvider } from '@/context/RepositoryContext';

SplashScreen.preventAutoHideAsync();

const rhymanceDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#ff6b9d',
    background: '#121212',
    card: '#1e1e1e',
    text: '#ffffff',
    border: 'rgba(255, 255, 255, 0.1)',
  },
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <RepositoryProvider>
      <ThemeProvider value={colorScheme === 'dark' ? rhymanceDarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <AppTabs />
      </ThemeProvider>
    </RepositoryProvider>
  );
}
