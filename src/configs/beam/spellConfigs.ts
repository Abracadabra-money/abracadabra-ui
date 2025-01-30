import abi from "@/abis/beam";
import type { BeamConfig } from "@/helpers/beam/types";
import { getChainIcon } from "@/helpers/chains/getChainIcon";

export const spellConfigs: BeamConfig[] = [
  {
    chainId: 1,
    icon: getChainIcon(1),
    chainName: "Ethereum",
    contract: {
      address: "0x48c95D958fd0Ef6ecF7fEb8d592c4D5a70f1AfBE",
      abi: abi.transparentUpgradeableProxy,
    },
    outboundProofType: 2,
    executor: "0x173272739Bd7Aa6e4e214714048a9fE699453059",
    settings: {
      contractVersion: 1,
      disabledDestinationChains: [],
      lzChainId: 30101,
      lzVersion: 2,
    },
    defaultValue: {
      10: "0.000000587209028",
      56: "0.000548",
      137: "0.12769615656648925",
      250: "0.028548233315008973",
      1285: "0.01774",
      2222: "0.32",
      42161: "0.000197125401096902",
      43114: "0.007909505245705214",
      8453: "0.000197125401096902",
      81457: "0.000197125401096902",
    },
  },
  {
    chainId: 42161,
    icon: getChainIcon(42161),
    chainName: "Arbitrum",
    contract: {
      address: "0x5b80901Ff867E541465057cB37dE6b8c6E5FB133",
      abi: abi.LzIndirectOFTV2,
    },
    outboundProofType: 2,
    executor: "0x31CAe3B7fB82d847621859fb1585353c5720660D",
    settings: {
      contractVersion: 1,
      disabledDestinationChains: [],
      lzChainId: 30110,
      lzVersion: 2,
    },
    defaultValue: {
      1: "0.008858578698816767",
      10: "0.00000285787311",
      56: "0.0032258135959937",
      137: "0.12769615656648925",
      250: "0.04645576777626232",
      1285: "0.01774",
      2222: "0.32",
      43114: "0.007487999650150403",
      8453: "0.008858578698816767",
      59144: "0.008858578698816767",
      81457: "0.000197125401096902",
    },
  },
];
