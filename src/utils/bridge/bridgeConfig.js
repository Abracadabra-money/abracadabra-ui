import contracts from "@/utils/abi/bridge/index";

import ethIcon from "@/assets/images/bridge/ETH.png";
import fantomIcon from "@/assets/images/bridge/FTM.png";
import polygonIcon from "@/assets/images/bridge/MATIC.png";
import binanceIcon from "@/assets/images/bridge/BNB.png";
import avalancheIcon from "@/assets/images/bridge/AVAX.png";
import arbitrumIcon from "@/assets/images/bridge/Arbitrum.png";

export default [
  {
    chainId: 1,
    chainName: "ETH",
    chainIcon: ethIcon,
    methodName: "anySwapOutUnderlying(address,address,uint256,uint256)",
    contract: {
      name: "AnyswapV4Router",
      address: "0x6b7a87899490EcE95443e979cA9485CBE7E71522",
      abi: contracts.AnyswapV4Router,
    },
    chainsInfo: [
      {
        name: "FTM",
        icon: fantomIcon,
        chainId: 250,
        tokenAddr: "0xbbc4A8d076F4B1888fec42581B6fc58d242CF2D5",
      },
      {
        name: "BSC",
        icon: binanceIcon,
        chainId: 56,
        tokenAddr: "0xbbc4A8d076F4B1888fec42581B6fc58d242CF2D5",
      },
      {
        name: "AVAX",
        icon: avalancheIcon,
        chainId: 43114,
        tokenAddr: "0xbbc4A8d076F4B1888fec42581B6fc58d242CF2D5",
      },
      {
        name: "AETH",
        icon: arbitrumIcon,
        chainId: 42161,
        tokenAddr: "0xbbc4A8d076F4B1888fec42581B6fc58d242CF2D5",
      },
      {
        name: "MATIC",
        icon: polygonIcon,
        chainId: 137,
        tokenAddr: "0xbbc4A8d076F4B1888fec42581B6fc58d242CF2D5",
      },
    ],
  },
  {
    chainId: 43114,
    chainName: "AVAX",
    chainIcon: avalancheIcon,
    methodName: "anySwapOut(address,address,uint256,uint256)",
    contract: {
      name: "AnyswapV4Router",
      address: "0xB0731d50C681C45856BFc3f7539D5f61d4bE81D8",
      abi: contracts.AnyswapV4Router,
    },
    chainsInfo: [
      {
        name: "ETH",
        icon: ethIcon,
        chainId: 1,
        tokenAddr: "0x130966628846BFd36ff31a822705796e8cb8C18D",
      },
      {
        name: "FTM",
        icon: fantomIcon,
        chainId: 250,
        tokenAddr: "0x130966628846BFd36ff31a822705796e8cb8C18D",
      },
      {
        name: "BSC",
        icon: binanceIcon,
        chainId: 56,
        tokenAddr: "0x130966628846BFd36ff31a822705796e8cb8C18D",
      },
      {
        name: "AETH",
        icon: arbitrumIcon,
        chainId: 42161,
        tokenAddr: "0x130966628846BFd36ff31a822705796e8cb8C18D",
      },
      {
        name: "MATIC",
        icon: polygonIcon,
        chainId: 137,
        tokenAddr: "0x130966628846BFd36ff31a822705796e8cb8C18D",
      },
    ],
  },
  {
    chainId: 250,
    chainName: "FTM",
    chainIcon: fantomIcon,
    methodName: "anySwapOut(address,address,uint256,uint256)",
    contract: {
      name: "AnyswapV4Router",
      address: "0x1CcCA1cE62c62F7Be95d4A67722a8fDbed6EEcb4",
      abi: contracts.AnyswapV4Router,
    },
    chainsInfo: [
      {
        name: "ETH",
        icon: ethIcon,
        chainId: 1,
        tokenAddr: "0x82f0B8B456c1A451378467398982d4834b6829c1",
      },
      {
        name: "BSC",
        icon: binanceIcon,
        chainId: 56,
        tokenAddr: "0x82f0B8B456c1A451378467398982d4834b6829c1",
      },
      {
        name: "AVAX",
        icon: avalancheIcon,
        chainId: 43114,
        tokenAddr: "0x82f0B8B456c1A451378467398982d4834b6829c1",
      },
      {
        name: "AETH",
        icon: arbitrumIcon,
        chainId: 42161,
        tokenAddr: "0x82f0B8B456c1A451378467398982d4834b6829c1",
      },
      {
        name: "MATIC",
        icon: polygonIcon,
        chainId: 137,
        tokenAddr: "0x82f0B8B456c1A451378467398982d4834b6829c1",
      },
    ],
  },
  {
    chainId: 56,
    chainName: "BSC",
    chainIcon: binanceIcon,
    methodName: "anySwapOut(address,address,uint256,uint256)",
    contract: {
      name: "AnyswapV4Router",
      address: "0xd1C5966f9F5Ee6881Ff6b261BBeDa45972B1B5f3",
      abi: contracts.AnyswapV4Router,
    },
    chainsInfo: [
      {
        name: "ETH",
        icon: ethIcon,
        chainId: 1,
        tokenAddr: "0xfE19F0B51438fd612f6FD59C1dbB3eA319f433Ba",
      },
      {
        name: "FTM",
        icon: fantomIcon,
        chainId: 250,
        tokenAddr: "0xfE19F0B51438fd612f6FD59C1dbB3eA319f433Ba",
      },
      {
        name: "AVAX",
        icon: avalancheIcon,
        chainId: 43114,
        tokenAddr: "0xfE19F0B51438fd612f6FD59C1dbB3eA319f433Ba",
      },
      {
        name: "AETH",
        icon: arbitrumIcon,
        chainId: 42161,
        tokenAddr: "0xfE19F0B51438fd612f6FD59C1dbB3eA319f433Ba",
      },
      {
        name: "MATIC",
        icon: polygonIcon,
        chainId: 137,
        tokenAddr: "0xfE19F0B51438fd612f6FD59C1dbB3eA319f433Ba",
      },
    ],
  },
  {
    chainId: 42161,
    chainName: "AETH",
    chainIcon: arbitrumIcon,
    methodName: "anySwapOut(address,address,uint256,uint256)",
    contract: {
      name: "AnyswapV4Router",
      address: "0xC931f61B1534EB21D8c11B24f3f5Ab2471d4aB50",
      abi: contracts.AnyswapV4Router,
    },
    chainsInfo: [
      {
        name: "ETH",
        icon: ethIcon,
        chainId: 1,
        tokenAddr: "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
      },
      {
        name: "FTM",
        icon: fantomIcon,
        chainId: 250,
        tokenAddr: "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
      },
      {
        name: "AVAX",
        icon: avalancheIcon,
        chainId: 43114,
        tokenAddr: "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
      },
      {
        name: "BSC",
        icon: binanceIcon,
        chainId: 56,
        tokenAddr: "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
      },
      {
        name: "MATIC",
        icon: polygonIcon,
        chainId: 137,
        tokenAddr: "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
      },
    ],
  },
  {
    chainId: 137,
    chainName: "MATIC",
    chainIcon: polygonIcon,
    methodName: "anySwapOut(address,address,uint256,uint256)",
    contract: {
      name: "AnyswapV4Router",
      address: "0x4f3Aff3A747fCADe12598081e80c6605A8be192F",
      abi: contracts.AnyswapV4Router,
    },
    chainsInfo: [
      {
        name: "ETH",
        icon: ethIcon,
        chainId: 1,
        tokenAddr: "0x49a0400587A7F65072c87c4910449fDcC5c47242",
      },
      {
        name: "FTM",
        icon: fantomIcon,
        chainId: 250,
        tokenAddr: "0x49a0400587A7F65072c87c4910449fDcC5c47242",
      },
      {
        name: "AVAX",
        icon: avalancheIcon,
        chainId: 43114,
        tokenAddr: "0x49a0400587A7F65072c87c4910449fDcC5c47242",
      },
      {
        name: "BSC",
        icon: binanceIcon,
        chainId: 56,
        tokenAddr: "0x49a0400587A7F65072c87c4910449fDcC5c47242",
      },
      {
        name: "AETH",
        icon: arbitrumIcon,
        chainId: 42161,
        tokenAddr: "0x49a0400587A7F65072c87c4910449fDcC5c47242",
      },
    ],
  },
];
