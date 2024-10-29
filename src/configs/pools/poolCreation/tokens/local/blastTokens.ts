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
  {
    chainId: BLAST_CHAIN_ID,
    address: "0xc7Edf7B7b3667a06992508e7B156eff794a9e1c8",
    name: "XPRT native asset",
    symbol: "XPRT",
    //todo new token icon
    icon: useImage("assets/images/base_token_icon.png"),
    decimals: 6,
    abi: erc20Abi,
  },
  {
    chainId: BLAST_CHAIN_ID,
    address: "0xE36072DD051Ce26261BF50CD966311cab62C596e",
    name: "Thruster",
    symbol: "THRUST",
    //todo new token icon
    icon: useImage("assets/images/base_token_icon.png"),
    decimals: 18,
    abi: erc20Abi,
  },
  {
    chainId: BLAST_CHAIN_ID,
    address: "0x818a92bc81Aad0053d72ba753fb5Bc3d0C5C0923",
    name: "Juice",
    symbol: "JUICE",
    //todo new token icon
    icon: useImage("assets/images/base_token_icon.png"),
    decimals: 18,
    abi: erc20Abi,
  },
  {
    chainId: BLAST_CHAIN_ID,
    address: "0x15bD262ede6E8aA04b2361a1Df697adF1Cf40e75",
    name: "Petoshi",
    symbol: "PETOSHI",
    //todo new token icon
    icon: useImage("assets/images/base_token_icon.png"),
    decimals: 18,
    abi: erc20Abi,
  },
  {
    chainId: BLAST_CHAIN_ID,
    address: "0x5ffd9EbD27f2fcAB044c0f0a26A45Cb62fa29c06",
    name: "PacMoon",
    symbol: "PAC",
    //todo new token icon
    icon: useImage("assets/images/base_token_icon.png"),
    decimals: 18,
    abi: erc20Abi,
  },
  {
    chainId: BLAST_CHAIN_ID,
    address: "0x9FE9991dAF6b9a5d79280F48cbb6827D46DE2EA4",
    name: "HyperBlast",
    symbol: "HYPE",
    //todo new token icon
    icon: useImage("assets/images/base_token_icon.png"),
    decimals: 9,
    abi: erc20Abi,
  },
  {
    chainId: BLAST_CHAIN_ID,
    address: "0xb1a5700fA2358173Fe465e6eA4Ff52E36e88E2ad",
    name: "Blast",
    symbol: "BLAST",
    //todo new token icon
    icon: useImage("assets/images/base_token_icon.png"),
    decimals: 18,
    abi: erc20Abi,
  },
];

export default blastTokens;
