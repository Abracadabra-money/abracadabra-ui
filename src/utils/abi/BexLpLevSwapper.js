export default [
  {
    inputs: [
      {
        internalType: "contract IBentoBoxV1",
        name: "_bentoBox",
        type: "address",
      },
      {
        internalType: "contract IBerachainBex",
        name: "_bex",
        type: "address",
      },
      {
        internalType: "address",
        name: "_pool",
        type: "address",
      },
      {
        internalType: "address",
        name: "_lp",
        type: "address",
      },
      {
        internalType: "address",
        name: "_mim",
        type: "address",
      },
      {
        internalType: "address",
        name: "_zeroXExchangeProxy",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ErrSwapFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "bentoBox",
    outputs: [
      {
        internalType: "contract IBentoBoxV1",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bex",
    outputs: [
      {
        internalType: "contract IBerachainBex",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lp",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mim",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pool",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "shareToMin",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "shareFrom",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "swap",
    outputs: [
      {
        internalType: "uint256",
        name: "extraShare",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "shareReturned",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "zeroXExchangeProxy",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
