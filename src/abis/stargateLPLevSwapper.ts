export default [
  {
    inputs: [
      { internalType: "contract IBentoBoxLite", name: "_box", type: "address" },
      {
        internalType: "contract IStargatePool",
        name: "_pool",
        type: "address",
      },
      { internalType: "uint256", name: "_poolId", type: "uint256" },
      {
        internalType: "contract IStargateRouter",
        name: "_stargateRouter",
        type: "address",
      },
      { internalType: "address", name: "_mim", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "ErrSwapFailed", type: "error" },
  {
    inputs: [],
    name: "box",
    outputs: [
      { internalType: "contract IBentoBoxLite", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mim",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pool",
    outputs: [
      { internalType: "contract IStargatePool", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "poolId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "stargateRouter",
    outputs: [
      { internalType: "contract IStargateRouter", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "shareToMin", type: "uint256" },
      { internalType: "uint256", name: "shareFrom", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "swap",
    outputs: [
      { internalType: "uint256", name: "extraShare", type: "uint256" },
      { internalType: "uint256", name: "shareReturned", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "underlyingToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
];
