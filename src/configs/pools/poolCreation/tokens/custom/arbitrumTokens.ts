import erc20Abi from "@/abis/farm/erc20Abi";
import { useImage } from "@/helpers/useImage";
import type { PoolCreationTokenConfig } from "@/configs/pools/poolCreation/types";
import { ARBITRUM_CHAIN_ID } from "@/constants/global";

const arbitrumTokens: Array<PoolCreationTokenConfig> = [
    {
        chainId: ARBITRUM_CHAIN_ID,
        address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        name: "Wrapped Ether",
        symbol: "WETH",
        icon: useImage(`assets/images/tokens/WETH.png`),
        decimals: 18,
        abi: erc20Abi
    },
    {
        chainId: ARBITRUM_CHAIN_ID,
        address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
        name: "Arbitrum",
        symbol: "ARB",
        icon: useImage(`assets/images/tokens/AETH.png`),
        decimals: 18,
        abi: erc20Abi,
    }
];

export default arbitrumTokens;
