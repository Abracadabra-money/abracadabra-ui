import { ZERO_ADDRESS } from "@/constants/gm";
import { routers } from "@/configs/pools/routers";
import type { Address } from "viem";
import { NIBIRU_CHAIN_ID } from "@/constants/global";
import type { ActionConfig } from "../actions/createPool";

// Legacy router ABI
const LEGACY_ROUTER_ABI = [
  {
    inputs: [
      { internalType: "address", name: "baseToken", type: "address" },
      { internalType: "address", name: "quoteToken", type: "address" },
      { internalType: "uint256", name: "lpFeeRate", type: "uint256" },
      { internalType: "uint256", name: "i", type: "uint256" },
      { internalType: "uint256", name: "k", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "baseInAmount", type: "uint256" },
      { internalType: "uint256", name: "quoteInAmount", type: "uint256" },
      { internalType: "bool", name: "protocolOwnedPool", type: "bool" },
    ],
    name: "createPool",
    outputs: [
      { internalType: "address", name: "clone", type: "address" },
      { internalType: "uint256", name: "shares", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "bool", name: "useTokenAsQuote", type: "bool" },
      { internalType: "uint256", name: "lpFeeRate", type: "uint256" },
      { internalType: "uint256", name: "i", type: "uint256" },
      { internalType: "uint256", name: "k", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenInAmount", type: "uint256" },
      { internalType: "bool", name: "protocolOwnedPool", type: "bool" },
    ],
    name: "createPoolETH",
    outputs: [
      { internalType: "address", name: "clone", type: "address" },
      { internalType: "uint256", name: "shares", type: "uint256" },
    ],
    stateMutability: "payable",
    type: "function",
  },
];

// New router ABI
const NEW_ROUTER_ABI = [
  {
    inputs: [
      { internalType: "address", name: "baseToken", type: "address" },
      { internalType: "address", name: "quoteToken", type: "address" },
      { internalType: "uint256", name: "lpFeeRate", type: "uint256" },
      { internalType: "uint256", name: "i", type: "uint256" },
      { internalType: "uint256", name: "k", type: "uint256" },
      { internalType: "address", name: "oracle", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "baseInAmount", type: "uint256" },
      { internalType: "uint256", name: "quoteInAmount", type: "uint256" },
    ],
    name: "createPool",
    outputs: [
      { internalType: "address", name: "clone", type: "address" },
      { internalType: "uint256", name: "shares", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "bool", name: "useTokenAsQuote", type: "bool" },
      { internalType: "uint256", name: "lpFeeRate", type: "uint256" },
      { internalType: "uint256", name: "i", type: "uint256" },
      { internalType: "uint256", name: "k", type: "uint256" },
      { internalType: "address", name: "oracle", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenInAmount", type: "uint256" },
    ],
    name: "createPoolETH",
    outputs: [
      { internalType: "address", name: "clone", type: "address" },
      { internalType: "uint256", name: "shares", type: "uint256" },
    ],
    stateMutability: "payable",
    type: "function",
  },
];

// Legacy router addresses from config
const LEGACY_ROUTER_ADDRESSES = Object.values(routers).filter(
  (router) => router != routers[NIBIRU_CHAIN_ID]
) as Address[];

export function getPoolAbiAndPayloadHandler(routerAddress: Address) {
  const isLegacyRouter = LEGACY_ROUTER_ADDRESSES.includes(routerAddress);

  if (isLegacyRouter) {
    return {
      createPool: (payload: ActionConfig) => {
        const {
          baseToken,
          quoteToken,
          lpFeeRate,
          I,
          K,
          to,
          baseInAmount,
          quoteInAmount,
          protocolOwnedPool,
        } = payload;

        return {
          address: routerAddress,
          abi: LEGACY_ROUTER_ABI,
          functionName: "createPool",
          args: [
            baseToken,
            quoteToken,
            lpFeeRate,
            I,
            K,
            to,
            baseInAmount,
            quoteInAmount,
            protocolOwnedPool,
          ],
        };
      },
      createPoolETH: (payload: ActionConfig, useTokenAsQuote: boolean) => {
        const {
          baseToken,
          quoteToken,
          lpFeeRate,
          I,
          K,
          to,
          baseInAmount,
          quoteInAmount,
          protocolOwnedPool,
        } = payload;

        const value = useTokenAsQuote ? baseInAmount : quoteInAmount;
        const token = useTokenAsQuote ? quoteToken : baseToken;
        const tokenInAmount = useTokenAsQuote ? quoteInAmount : baseInAmount;

        return {
          address: routerAddress,
          abi: LEGACY_ROUTER_ABI,
          functionName: "createPoolETH",
          args: [
            token,
            useTokenAsQuote,
            lpFeeRate,
            I,
            K,
            to,
            tokenInAmount,
            protocolOwnedPool,
          ],
          value,
        };
      },
    };
  }

  // New version for all other routers
  return {
    createPool: (payload: ActionConfig) => {
      const {
        baseToken,
        quoteToken,
        lpFeeRate,
        I,
        K,
        to,
        baseInAmount,
        quoteInAmount,
      } = payload;

      return {
        address: routerAddress,
        abi: NEW_ROUTER_ABI,
        functionName: "createPool",
        args: [
          baseToken,
          quoteToken,
          lpFeeRate,
          I,
          K,
          ZERO_ADDRESS, // oracle
          to,
          baseInAmount,
          quoteInAmount,
        ],
      };
    },
    createPoolETH: (payload: ActionConfig, useTokenAsQuote: boolean) => {
      const {
        baseToken,
        quoteToken,
        lpFeeRate,
        I,
        K,
        to,
        baseInAmount,
        quoteInAmount,
      } = payload;

      const value = useTokenAsQuote ? baseInAmount : quoteInAmount;
      const token = useTokenAsQuote ? quoteToken : baseToken;
      const tokenInAmount = useTokenAsQuote ? quoteInAmount : baseInAmount;

      return {
        address: routerAddress,
        abi: NEW_ROUTER_ABI,
        functionName: "createPoolETH",
        args: [
          token,
          useTokenAsQuote,
          lpFeeRate,
          I,
          K,
          ZERO_ADDRESS, // oracle
          to,
          tokenInAmount,
        ],
        value,
      };
    },
  };
}
