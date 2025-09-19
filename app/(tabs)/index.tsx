import { useEffect } from 'react';
import { router, useRootNavigationState } from 'expo-router';

export default function IndexScreen() {
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    // Only redirect when navigation state is ready
    if (rootNavigationState?.isLoaded) {
      router.replace('/(tabs)/login');
    }
  }, [rootNavigationState?.isLoaded]);

  return null;
}