import { filterRpcUrls } from "@/helpers/connect/utils";
import { moonriver, base, linea } from "@wagmi/core/chains";
import { mainnet, arbitrum, blast, kava } from "@wagmi/core/chains";
import { avalanche, optimism, fantom, bsc, polygon } from "@wagmi/core/chains";
import { BERA_CHAIN_ID, BLAST_CHAIN_ID } from "@/constants/global";
import { BSC_CHAIN_ID, FANTOM_CHAIN_ID } from "@/constants/global";
import { KAVA_CHAIN_ID, LINEA_CHAIN_ID } from "@/constants/global";
import { OPTIMISM_CHAIN_ID, POLIGON_CHAIN_ID } from "@/constants/global";
import { BASE_CHAIN_ID, BERA_BARTIO_CHAIN_ID } from "@/constants/global";
import { MAINNET_CHAIN_ID, MOONRIVER_CHAIN_ID } from "@/constants/global";
import { ARBITRUM_CHAIN_ID, AVALANCHE_CHAIN_ID } from "@/constants/global";

export const DEFAULT_BERA_RPC = "https://rpc.berachain.com";
export const DEFAULT_BERA_BARTIO_RPC = "https://bartio.rpc.berachain.com/";
export const DEFAULT_MAINNET_RPC = "https://ethereum.publicnode.com";
export const DEFAULT_ARBITRUM_RPC = "https://arb1.arbitrum.io/rpc";
export const DEFAULT_BLAST_RPC = "https://rpc.blast.io";
export const DEFAULT_KAVA_RPC = "https://evm.kava.io";
export const DEFAULT_AVALANCHE_RPC = "https://avalanche.drpc.org";
export const DEFAULT_OPTIMISM_RPC = "https://optimism.llamarpc.com";
export const DEFAULT_FANTOM_RPC = "https://fantom-rpc.publicnode.com";
export const DEFAULT_BSC_RPC = "https://bsc-dataseed.binance.org/";
export const DEFAULT_POLYGON_RPC = "https://polygon-rpc.com";
export const DEFAULT_MOONRIVER_RPC =
  "https://rpc.api.moonriver.moonbeam.network";
export const DEFAULT_BASE_RPC = "https://base.llamarpc.com";
export const DEFAULT_LINEA_RPC = "https://linea-rpc.publicnode.com";

// Here we add rpc that we do not want to use or they are not working
export const badRequestListRpc = [
  "https://mainnet.optimism.io",
  "https://mainnet.base.org",
  "https://evm.kava.chainstacklabs.com",
];

export const rpsList = {
  [BERA_CHAIN_ID]: [DEFAULT_BERA_RPC],
  [BERA_BARTIO_CHAIN_ID]: [DEFAULT_BERA_BARTIO_RPC],
  [MAINNET_CHAIN_ID]: [
    ...mainnet.rpcUrls.default.http,
    DEFAULT_MAINNET_RPC,
    "https://eth.llamarpc.com",
    "https://eth.drpc.org",
    "https://rpc.ankr.com/eth",
  ],
  [ARBITRUM_CHAIN_ID]: [
    ...arbitrum.rpcUrls.default.http,
    DEFAULT_ARBITRUM_RPC,
    "https://arbitrum.llamarpc.com",
    "https://1rpc.io/arb",
    "https://arbitrum-one.public.blastapi.io",
    "https://arbitrum.meowrpc.com",
  ],
  [BLAST_CHAIN_ID]: [
    ...blast.rpcUrls.default.http,
    DEFAULT_BLAST_RPC,
    "https://blast.din.dev/rpc",
    "https://blast.blockpi.network/v1/rpc/public",
    "https://blastl2-mainnet.public.blastapi.io",
    "https://rpc.ankr.com/blast",
  ],
  [KAVA_CHAIN_ID]: [
    ...kava.rpcUrls.default.http,
    DEFAULT_KAVA_RPC,
    "https://kava-evm-rpc.publicnode.com",
    "https://kava-pokt.nodies.app",
    "https://kava.drpc.org",
  ],
  [AVALANCHE_CHAIN_ID]: [
    ...avalanche.rpcUrls.default.http,
    DEFAULT_AVALANCHE_RPC,
    "https://rpc.ankr.com/avalanche",
    "https://avalanche-c-chain-rpc.publicnode.com",
    "https://api.avax.network/ext/bc/C/rpc",
  ],
  [OPTIMISM_CHAIN_ID]: [
    ...optimism.rpcUrls.default.http,
    DEFAULT_OPTIMISM_RPC,
    "https://optimism-mainnet.public.blastapi.io",
    "https://rpc.ankr.com/optimism",
    "https://1rpc.io/op",
  ],
  [FANTOM_CHAIN_ID]: [
    ...fantom.rpcUrls.default.http,
    DEFAULT_FANTOM_RPC,
    "https://1rpc.io/ftm",
    "https://rpcapi.fantom.network",
    "https://fantom-mainnet.public.blastapi.io",
  ],
  [BSC_CHAIN_ID]: [
    ...bsc.rpcUrls.default.http,
    DEFAULT_BSC_RPC,
    "https://bsc-dataseed1.ninicoin.io",
    "https://bsc-dataseed2.ninicoin.io",
    "https://bsc-dataseed3.ninicoin.io",
    "https://binance.llamarpc.com",
  ],
  [POLIGON_CHAIN_ID]: [
    ...polygon.rpcUrls.default.http,
    DEFAULT_POLYGON_RPC,
    "https://polygon.llamarpc.com",
    "https://endpoints.omniatech.io/v1/matic/mainnet/public",
  ],
  [MOONRIVER_CHAIN_ID]: [
    ...moonriver.rpcUrls.default.http,
    DEFAULT_MOONRIVER_RPC,
    "https://moonriver-rpc.dwellir.com",
    "https://moonriver.drpc.org",
    "https://moonriver-rpc.publicnode.com",
    "https://moonriver.public.blastapi.io",
  ],
  [BASE_CHAIN_ID]: [
    ...base.rpcUrls.default.http,
    DEFAULT_BASE_RPC,
    "https://base.drpc.org",
    "https://base-rpc.publicnode.com",
    "https://base.meowrpc.com",
  ],
  [LINEA_CHAIN_ID]: [
    ...linea.rpcUrls.default.http,
    DEFAULT_LINEA_RPC,
    "https://rpc.linea.build",
    "https://linea.decubate.com",
    "https://linea.drpc.org",
    "https://1rpc.io/linea",
    "https://linea.blockpi.network/v1/rpc/public",
  ],
};

export const getRpcListByChainId = (chainId: number) => {
  if (!rpsList[chainId]) return filterRpcUrls(rpsList[MAINNET_CHAIN_ID]);
  return filterRpcUrls(rpsList[chainId]);
};
