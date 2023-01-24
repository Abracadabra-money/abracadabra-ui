export default [
  {
    inputs: [
      {
        internalType: "contract IBentoBoxV1",
        name: "_bentoBox",
        type: "address",
      },
      {
        internalType: "contract IStargatePool",
        name: "_pool",
        type: "address",
      },
      { internalType: "uint16", name: "_poolId", type: "uint16" },
      {
        internalType: "contract IStargateRouter",
        name: "_stargateRouter",
        type: "address",
      },
      { internalType: "contract IERC20", name: "_mim", type: "address" },
      { internalType: "address", name: "_zeroXExchangeProxy", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "ErrApproveFailed", type: "error" },
  {
    inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
    name: "ErrApproveFailedWithData",
    type: "error",
  },
  { inputs: [], name: "ErrSwapFailed", type: "error" },
  {
    inputs: [],
    name: "bentoBox",
    outputs: [
      { internalType: "contract IBentoBoxV1", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mim",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
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
    outputs: [{ internalType: "uint16", name: "", type: "uint16" }],
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
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "shareToMin", type: "uint256" },
      { internalType: "uint256", name: "shareFrom", type: "uint256" },
      { internalType: "bytes", name: "swapData", type: "bytes" },
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
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "zeroXExchangeProxy",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
];
