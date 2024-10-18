import type { PoolCreationTokenConfig } from "@/configs/pools/poolCreation/types";
import store from "@/store";

export const updateLocalStorageCustomTokens = (tokenConfig: PoolCreationTokenConfig) => {
    const customTokens: PoolCreationTokenConfig[] = store.getters.getPoolCreationCustomTokens.data

    const tokenExists = customTokens.some(token => JSON.stringify(token) === JSON.stringify(tokenConfig));

    if (!tokenExists) {
        customTokens.push(tokenConfig);

        store.commit('setPoolCreationCustomTokensData', customTokens)
    }
}

