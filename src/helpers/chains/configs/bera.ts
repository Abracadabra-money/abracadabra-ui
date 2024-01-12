import { useImage } from "@/helpers/useImage";

export const berachainConfig = {
  id: 80085,
  chainId: 80085,
  name: "Berachain Artio",
  network: "berachain-testnet",
  nativeCurrency: { name: "BERA", symbol: "BERA", decimals: 18 },
  rpcUrls: {
    public: { http: ["https://artio.rpc.berachain.com/"] },
    default: { http: ["https://artio.rpc.berachain.com/"] },
  },
  blockExplorers: {
    etherscan: { name: "Berascan", url: "https://artio.beratrail.io/" },
    default: { name: "Berascan", url: "https://artio.beratrail.io/" },
  },
//   contracts: {
//     multicall3: {
//       address: "0xcA11bde05977b3631167028862bE2a173976CA11",
//       blockCreated: 5022,
//     },
//   },
  symbol: "BERA",
  icon: useImage("assets/images/networks/base.png"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  networkIcon: useImage(`assets/images/networks/base.png`),
//   lzChainId: 184,
};
