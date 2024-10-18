import erc20Abi from "@/abis/farm/erc20Abi";
import { useImage } from "@/helpers/useImage";
import type { PoolCreationTokenConfig } from "@/configs/pools/poolCreation/types";
import { ARBITRUM_CHAIN_ID } from "@/constants/global";

const arbitrumTokens: Array<PoolCreationTokenConfig> = [];

export default arbitrumTokens;
