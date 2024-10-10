import erc20Abi from "@/abis/farm/erc20Abi";
import { useImage } from "@/helpers/useImage";
import type { PoolCreationTokenConfig } from "@/configs/pools/poolCreation/types";
import { BLAST_CHAIN_ID } from "@/constants/global";

const blastTokens: Array<PoolCreationTokenConfig> = [
  {
    chainId: BLAST_CHAIN_ID,
    address: "0x76DA31D7C9CbEAE102aff34D3398bC450c8374c1",
    name: "Magic Internet Money",
    symbol: "MIM",
    icon: useImage(`assets/images/tokens/MIM.png`),
    decimals: 18,
    abi: erc20Abi,
  },
  {
    chainId: BLAST_CHAIN_ID,
    address: "0x76DA31D7C9CbEAE102aff34D3398bC450c8374c1",
    name: "USDB",
    symbol: "USDB",
    icon: useImage("assets/images/tokens/USDB.png"),
    decimals: 18,
    abi: erc20Abi,
  },
];

export default blastTokens;
