import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { store } from '@/redux/store';
import { ReduxThemeProvider } from '@/theme/ReduxThemeProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ReduxThemeProvider>{children}</ReduxThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}
