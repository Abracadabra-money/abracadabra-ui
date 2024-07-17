import erc20Abi from "@/abis/farm/erc20Abi";
import { useImage } from "@/helpers/useImage";
import type { PoolCreationTokenConfig } from "@/configs/pools/poolCreation/types";
import { ARBITRUM_CHAIN_ID } from "@/constants/global";

const arbitrumPools: Array<PoolCreationTokenConfig> = [
    {
        chainId: ARBITRUM_CHAIN_ID,
        address: "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
        name: 'Magic Internet Money',
        symbol: "MIM",
        icon: useImage(`assets/images/tokens/MIM.png`),
        decimals: 18,
        abi: erc20Abi,
    },
    {
        name: "Tether",
        symbol: 'USDt',
        icon: useImage(`assets/images/tokens/USDT.png`),
        chainId: ARBITRUM_CHAIN_ID,
        decimals: 6,
        address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        abi: erc20Abi,

    },
];

export default arbitrumPools;
