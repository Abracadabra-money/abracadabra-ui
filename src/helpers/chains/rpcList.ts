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
export const DEFAULT_BERA_BARTIO_RPC =
  "https://berachain-testnet-rpc.publicnode.com";
export const DEFAULT_MAINNET_RPC = "https://ethereum.publicnode.com";
export const DEFAULT_ARBITRUM_RPC = "https://arbitrum-one-rpc.publicnode.com";
export const DEFAULT_BLAST_RPC = "https://rpc.blast.io";
export const DEFAULT_KAVA_RPC = "https://evm.kava.io";
export const DEFAULT_AVALANCHE_RPC = "https://avalanche.drpc.org";
export const DEFAULT_OPTIMISM_RPC = "https://optimism-rpc.publicnode.com";
export const DEFAULT_FANTOM_RPC = "https://fantom-rpc.publicnode.com";
export const DEFAULT_BSC_RPC = "https://bsc-pokt.nodies.app";
export const DEFAULT_POLYGON_RPC = "https://polygon-rpc.com";
export const DEFAULT_MOONRIVER_RPC =
  "https://rpc.api.moonriver.moonbeam.network";
export const DEFAULT_BASE_RPC = "https://base-rpc.publicnode.com";
export const DEFAULT_LINEA_RPC = "https://linea-rpc.publicnode.com";

// Here we add rpc that we do not want to use or they are not working
export const badRequestListRpc = [
  "https://mainnet.optimism.io",
  "https://mainnet.base.org",
  "https://evm.kava.chainstacklabs.com",
  "https://arbitrum.llamarpc.com",
  "https://base.llamarpc.com",
  "https://binance.llamarpc.com",
  "https://eth.llamarpc.com",
  "https://optimism.llamarpc.com",
  "https://polygon.llamarpc.com",
  "https://rpc.ankr.com/bsc",
];

export const rpcList = {
  [BERA_CHAIN_ID]: [
    DEFAULT_BERA_RPC,
    "https://berachain-rpc.publicnode.com",
    "https://berachain.drpc.org",
  ],
  [BERA_BARTIO_CHAIN_ID]: [
    DEFAULT_BERA_BARTIO_RPC,
    "https://berat2.lava.build",
  ],
  [MAINNET_CHAIN_ID]: [
    DEFAULT_MAINNET_RPC,
    "https://eth.drpc.org",
    "https://rpc.ankr.com/eth",
    ...mainnet.rpcUrls.default.http,
  ],
  [ARBITRUM_CHAIN_ID]: [
    ...arbitrum.rpcUrls.default.http,
    DEFAULT_ARBITRUM_RPC,
    "https://arbitrum.drpc.org",
    "https://rpc.ankr.com/arbitrum/55b4fe172f3387cb12783ef3823c857bfa559f115657d5c8ac9fa4b6abeb14e4",
    "https://arb1.arbitrum.io/rpc",
    "https://1rpc.io/arb",
  ],
  [BLAST_CHAIN_ID]: [
    ...blast.rpcUrls.default.http,
    DEFAULT_BLAST_RPC,
    "https://blast-rpc.publicnode.com",
    "https://blast.drpc.org",
    "https://rpc.ankr.com/blast/55b4fe172f3387cb12783ef3823c857bfa559f115657d5c8ac9fa4b6abeb14e4",
    "https://blast.din.dev/rpc",
  ],
  [KAVA_CHAIN_ID]: [
    ...kava.rpcUrls.default.http,
    DEFAULT_KAVA_RPC,
    "https://kava-evm-rpc.publicnode.com",
    "https://kava.drpc.org",
    "https://kava-pokt.nodies.app",
    "https://rpc.ankr.com/premium-http/kava_api/55b4fe172f3387cb12783ef3823c857bfa559f115657d5c8ac9fa4b6abeb14e4",
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
    "https://optimism.drpc.org",
    "https://rpc.ankr.com/optimism",
    "https://optimism-mainnet.public.blastapi.io",
    "https://1rpc.io/op",
  ],
  [FANTOM_CHAIN_ID]: [
    ...fantom.rpcUrls.default.http,
    DEFAULT_FANTOM_RPC,
    "https://fantom.drpc.org",
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
    "https://bsc-rpc.publicnode.com",
    "https://bsc.drpc.org",
  ],
  [POLIGON_CHAIN_ID]: [
    ...polygon.rpcUrls.default.http,
    DEFAULT_POLYGON_RPC,
    "https://polygon-bor-rpc.publicnode.com",
    "https://polygon.drpc.org",
    "https://endpoints.omniatech.io/v1/matic/mainnet/public",
  ],
  [MOONRIVER_CHAIN_ID]: [
    ...moonriver.rpcUrls.default.http,
    DEFAULT_MOONRIVER_RPC,
    "https://moonriver-rpc.publicnode.com",
    "https://moonriver.drpc.org",
    "https://moonriver-rpc.dwellir.com",
    "https://moonriver.public.blastapi.io",
  ],
  [BASE_CHAIN_ID]: [
    ...base.rpcUrls.default.http,
    DEFAULT_BASE_RPC,
    "https://base.drpc.org",
    "https://rpc.ankr.com/base/55b4fe172f3387cb12783ef3823c857bfa559f115657d5c8ac9fa4b6abeb14e4",
    "https://base.meowrpc.com",
  ],
  [LINEA_CHAIN_ID]: [
    ...linea.rpcUrls.default.http,
    DEFAULT_LINEA_RPC,
    "https://linea.drpc.org",
    "https://rpc.linea.build",
    "https://linea.decubate.com",
    "https://1rpc.io/linea",
    "https://linea.blockpi.network/v1/rpc/public",
  ],
};
