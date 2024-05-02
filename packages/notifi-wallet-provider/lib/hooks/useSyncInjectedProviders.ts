import { useSyncExternalStore } from 'react';

import { store } from './store';

export const useSyncInjectedProviders = () =>
  useSyncExternalStore(store.subscribe, store.value, store.value);
