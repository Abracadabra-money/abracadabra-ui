export default [
  {
    inputs: [
      { internalType: "bytes32", name: "_merkleRoot", type: "bytes32" },
      { internalType: "string", name: "_ipfsMerkleProofs", type: "string" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "maxBorrowAmount",
        type: "uint256",
      },
    ],
    name: "LogSetMaxBorrow",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "amountAllowed",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "newBorrowAmount", type: "uint256" },
    ],
    name: "getBorrowStatus",
    outputs: [{ internalType: "bool", name: "success", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ipfsMerkleProofs",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "merkleRoot",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "maxBorrow", type: "uint256" },
      { internalType: "bytes32[]", name: "merkleProof", type: "bytes32[]" },
    ],
    name: "setMaxBorrow",
    outputs: [{ internalType: "bool", name: "success", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];
