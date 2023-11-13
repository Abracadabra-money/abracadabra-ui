export default [
  {
    inputs: [],
    name: "refundWETH",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "isActive",
    outputs: [{ internalType: "bool", name: "value", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "balanceOf",
    inputs: [{ type: "address", name: "_account", internalType: "address" }],
  },
];
