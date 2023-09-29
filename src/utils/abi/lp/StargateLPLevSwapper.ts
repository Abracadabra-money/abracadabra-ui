export default [
  {
    type: "constructor",
    stateMutability: "nonpayable",
    inputs: [
      {
        type: "address",
        name: "_bentoBox",
        internalType: "contract IBentoBoxV1",
      },
      {
        type: "address",
        name: "_pool",
        internalType: "contract IStargatePool",
      },
      { type: "uint256", name: "_poolId", internalType: "uint256" },
      {
        type: "address",
        name: "_stargateRouter",
        internalType: "contract IStargateRouter",
      },
      { type: "address", name: "_mim", internalType: "contract IERC20" },
      { type: "address", name: "_zeroXExchangeProxy", internalType: "address" },
    ],
  },
  { type: "error", name: "ErrApproveFailed", inputs: [] },
  {
    type: "error",
    name: "ErrApproveFailedWithData",
    inputs: [{ type: "bytes", name: "data", internalType: "bytes" }],
  },
  { type: "error", name: "ErrSwapFailed", inputs: [] },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      { type: "address", name: "", internalType: "contract IBentoBoxV1" },
    ],
    name: "bentoBox",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "contract IERC20" }],
    name: "mim",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      { type: "address", name: "", internalType: "contract IStargatePool" },
    ],
    name: "pool",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "poolId",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      { type: "address", name: "", internalType: "contract IStargateRouter" },
    ],
    name: "stargateRouter",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [
      { type: "uint256", name: "extraShare", internalType: "uint256" },
      { type: "uint256", name: "shareReturned", internalType: "uint256" },
    ],
    name: "swap",
    inputs: [
      { type: "address", name: "recipient", internalType: "address" },
      { type: "uint256", name: "shareToMin", internalType: "uint256" },
      { type: "uint256", name: "shareFrom", internalType: "uint256" },
      { type: "bytes", name: "swapData", internalType: "bytes" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "contract IERC20" }],
    name: "underlyingToken",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "zeroXExchangeProxy",
    inputs: [],
  },
];
