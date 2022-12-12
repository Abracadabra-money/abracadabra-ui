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
    inputs: [
      { internalType: "address", name: "tokenOut", type: "address" },
      { internalType: "uint256", name: "glpAmount", type: "uint256" },
    ],
    name: "getTokenOutFromBurningGlp",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
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
