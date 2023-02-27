export default [
  {
    inputs: [
      {
        internalType: "contract IGmxGlpManager",
        name: "_manager",
        type: "address",
      },
      { internalType: "contract IGmxVault", name: "_vault", type: "address" },
      {
        internalType: "contract IGmxVaultReader",
        name: "_vaultReader",
        type: "address",
      },
      {
        internalType: "contract IGmxPositionManager",
        name: "_positionManager",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "_nativeToken",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "getGlpPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenIn", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "getMintedGlpFromTokenIn",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "getTokenInfo",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "poolAmount", type: "uint256" },
          { internalType: "uint256", name: "reservedAmount", type: "uint256" },
          { internalType: "uint256", name: "availableAmount", type: "uint256" },
          { internalType: "uint256", name: "usdgAmount", type: "uint256" },
          {
            internalType: "uint256",
            name: "redemptionAmount",
            type: "uint256",
          },
          { internalType: "uint256", name: "weight", type: "uint256" },
          { internalType: "uint256", name: "bufferAmount", type: "uint256" },
          { internalType: "uint256", name: "maxUsdgAmount", type: "uint256" },
          { internalType: "uint256", name: "globalShortSize", type: "uint256" },
          {
            internalType: "uint256",
            name: "maxGlobalShortSize",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxGlobalLongSize",
            type: "uint256",
          },
          { internalType: "uint256", name: "minPrice", type: "uint256" },
          { internalType: "uint256", name: "maxPrice", type: "uint256" },
          { internalType: "uint256", name: "guaranteedUsd", type: "uint256" },
          { internalType: "uint256", name: "maxPrimaryPrice", type: "uint256" },
          { internalType: "uint256", name: "minPrimaryPrice", type: "uint256" },
        ],
        internalType: "struct GmxLens.TokenInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenOut", type: "address" },
      { internalType: "uint256", name: "glpAmount", type: "uint256" },
    ],
    name: "getTokenOutFromBurningGlp",
    outputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "feeBasisPoints", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenIn", type: "address" },
      { internalType: "uint256", name: "tokenAmount", type: "uint256" },
    ],
    name: "getUsdgAmountFromTokenIn",
    outputs: [{ internalType: "uint256", name: "usdgAmount", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "manager",
    outputs: [
      { internalType: "contract IGmxGlpManager", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nativeToken",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "positionManager",
    outputs: [
      {
        internalType: "contract IGmxPositionManager",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "vault",
    outputs: [
      { internalType: "contract IGmxVault", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "vaultReader",
    outputs: [
      { internalType: "contract IGmxVaultReader", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
];
