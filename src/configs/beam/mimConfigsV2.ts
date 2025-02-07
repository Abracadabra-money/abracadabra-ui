import abi from "@/abis/beam";
import type { BeamConfigV2 } from "@/helpers/beam/types";
import { getChainIcon } from "@/helpers/chains/getChainIcon";

export const mimConfigsV2: BeamConfigV2[] = [
  {
    chainId: 1,
    icon: getChainIcon(1),
    chainName: "Ethereum",
    contract: {
      address: "0xE5169F892000fC3BEd5660f62C67FAEE7F97718B",
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
      80094: "0.1",
    },
  },
  {
    chainId: 80094,
    icon: getChainIcon(80094),
    chainName: "Berachain",
    contract: {
      address: "0x5B82028cfc477C4E7ddA7FF33d59A23FA7Be002a",
      abi: abi.transparentUpgradeableProxy,
    },
    outboundProofType: 2,
    executor: "0x4208D6E27538189bB48E603D6123A94b8Abe0A0b",
    settings: {
      contractVersion: 1,
      disabledDestinationChains: [
        42161, 2222, 43114, 10, 250, 56, 137, 1285, 8453, 59144, 81457,
      ],
      lzChainId: 30362,
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
];
