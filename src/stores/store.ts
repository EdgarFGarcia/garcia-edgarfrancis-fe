import {defineStore} from 'pinia';

import type { Store } from '@/types/store';

export const useStore = defineStore('storeFront', {
    state: () => ({
        stores: [],
        selectedStore: {}
    }),
    getters: {
        getStores: (state) => state.stores,
        getSelectedStore: (state) => state.selectedStore,
    },
    actions: {
        setStore(payload: Store) {
            this.stores = [...payload];
        },
        setSelectedStore(payload: Store) {
            this.selectedStore = payload;
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'stores',
                storage: sessionStorage,
            },
        ],
    },
})