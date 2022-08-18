export default [
  {
    inputs: [
      {
        internalType: "contract IBentoBoxV1",
        name: "degenBox",
        type: "address",
      },
      {
        internalType: "contract IERC20Vault",
        name: "wrapper",
        type: "address",
      },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "unwrap",
    outputs: [
      { internalType: "uint256", name: "amountOut", type: "uint256" },
      { internalType: "uint256", name: "shareOut", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IBentoBoxV1",
        name: "degenBox",
        type: "address",
      },
      {
        internalType: "contract IERC20Vault",
        name: "wrapper",
        type: "address",
      },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "wrap",
    outputs: [
      { internalType: "uint256", name: "amountOut", type: "uint256" },
      { internalType: "uint256", name: "shareOut", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];
