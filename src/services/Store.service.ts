import apiClient from "@/api/apiClient";

/**store */
import { useStore } from "@/stores/store";

/**type */
import type { Store } from "@/types/store";

const store = useStore();

export const storeService = {
    /**
     * get all stores
     */
    async getStores() {
        try{
            const response = await apiClient.get('/front/store');
            const { data } = response
            store.setStore(data);
        }catch(error){
            console.log('error on fetching all stores - service layer', error)
        }
    },

    selectedStore(item?: Store){
        store.setSelectedStore(item)
    }
}