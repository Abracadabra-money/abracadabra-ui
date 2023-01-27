export default [
  {
    inputs: [
      {
        internalType: "contract IBentoBoxV1",
        name: "_bentoBox",
        type: "address",
      },
      { internalType: "contract IERC20", name: "_glpVault", type: "address" },
      { internalType: "contract IERC20", name: "_mim", type: "address" },
      { internalType: "contract IERC20", name: "_sGLP", type: "address" },
      { internalType: "contract IERC20", name: "_usdc", type: "address" },
      { internalType: "address", name: "glpManager", type: "address" },
      {
        internalType: "contract IGmxGlpRewardRouter",
        name: "_glpRewardRouter",
        type: "address",
      },
      { internalType: "address", name: "_zeroXExchangeProxy", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
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
    name: "glpRewardRouter",
    outputs: [
      {
        internalType: "contract IGmxGlpRewardRouter",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "glpVault",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
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
    name: "sGLP",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
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
    name: "usdc",
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
