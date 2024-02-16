export default [
  {
    inputs: [
      {
        internalType: "contract IBentoBoxV1",
        name: "_degenBox",
        type: "address",
      },
      { internalType: "contract IERC4626", name: "_wrapper", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
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
