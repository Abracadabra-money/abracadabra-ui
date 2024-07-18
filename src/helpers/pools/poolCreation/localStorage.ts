import type { PoolCreationTokenConfig } from "@/configs/pools/poolCreation/types";
import { POOL_CREATION_CUSTOM_TOKENS_LS_KEY } from "@/constants/pools/poolCreation";

export const updateLocalStorageCustomTokens = (tokenConfig: PoolCreationTokenConfig) => {
    const customTokens = getLocalStorageCustomTokens()

    const tokenExists = customTokens.some(token => JSON.stringify(token) === JSON.stringify(tokenConfig));

    if (!tokenExists) {
        customTokens.push(tokenConfig);

        localStorage.setItem(POOL_CREATION_CUSTOM_TOKENS_LS_KEY, JSON.stringify(customTokens));
    }
}

export const getLocalStorageCustomTokens = (): PoolCreationTokenConfig[] => {
    const storedItem = localStorage.getItem(POOL_CREATION_CUSTOM_TOKENS_LS_KEY);
    return storedItem ? JSON.parse(storedItem) : [];
}
