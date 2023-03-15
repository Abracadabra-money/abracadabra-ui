export default [
  {
    inputs: [
      {
        internalType: "contract IGmxGlpManager",
        name: "_manager",
        type: "address",
      },
      { internalType: "contract IGmxVault", name: "_vault", type: "address" },
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
      { internalType: "contract IERC20", name: "tokenIn", type: "address" },
    ],
    name: "getMaxAmountIn",
    outputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
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
      { internalType: "uint256", name: "amountOut", type: "uint256" },
      { internalType: "uint256", name: "feeBasisPoints", type: "uint256" },
      { internalType: "uint256", name: "maxAmountIn", type: "uint256" },
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
    name: "vault",
    outputs: [
      { internalType: "contract IGmxVault", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
];
