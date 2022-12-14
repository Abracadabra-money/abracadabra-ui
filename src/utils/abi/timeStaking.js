export default [
  {
    type: "constructor",
    stateMutability: "nonpayable",
    inputs: [
      { type: "address", name: "_Time", internalType: "address" },
      { type: "address", name: "_Memories", internalType: "address" },
      { type: "uint32", name: "_epochLength", internalType: "uint32" },
      { type: "uint256", name: "_firstEpochNumber", internalType: "uint256" },
      { type: "uint32", name: "_firstEpochTime", internalType: "uint32" },
    ],
  },
  {
    type: "event",
    name: "OwnershipPulled",
    inputs: [
      {
        type: "address",
        name: "previousOwner",
        internalType: "address",
        indexed: true,
      },
      {
        type: "address",
        name: "newOwner",
        internalType: "address",
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipPushed",
    inputs: [
      {
        type: "address",
        name: "previousOwner",
        internalType: "address",
        indexed: true,
      },
      {
        type: "address",
        name: "newOwner",
        internalType: "address",
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "Memories",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "Time",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "claim",
    inputs: [{ type: "address", name: "_recipient", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "contractBalance",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "distributor",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      { type: "uint256", name: "number", internalType: "uint256" },
      { type: "uint256", name: "distribute", internalType: "uint256" },
      { type: "uint32", name: "length", internalType: "uint32" },
      { type: "uint32", name: "endTime", internalType: "uint32" },
    ],
    name: "epoch",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "forfeit",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "giveLockBonus",
    inputs: [{ type: "uint256", name: "_amount", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "index",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "locker",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "manager",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "pullManagement",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "pushManagement",
    inputs: [{ type: "address", name: "newOwner_", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "rebase",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "renounceManagement",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "returnLockBonus",
    inputs: [{ type: "uint256", name: "_amount", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setContract",
    inputs: [
      {
        type: "uint8",
        name: "_contract",
        internalType: "enum TimeStaking.CONTRACTS",
      },
      { type: "address", name: "_address", internalType: "address" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setWarmup",
    inputs: [
      { type: "uint256", name: "_warmupPeriod", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [{ type: "bool", name: "", internalType: "bool" }],
    name: "stake",
    inputs: [
      { type: "uint256", name: "_amount", internalType: "uint256" },
      { type: "address", name: "_recipient", internalType: "address" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "toggleDepositLock",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "totalBonus",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "unstake",
    inputs: [
      { type: "uint256", name: "_amount", internalType: "uint256" },
      { type: "bool", name: "_trigger", internalType: "bool" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "warmupContract",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      { type: "uint256", name: "deposit", internalType: "uint256" },
      { type: "uint256", name: "gons", internalType: "uint256" },
      { type: "uint256", name: "expiry", internalType: "uint256" },
      { type: "bool", name: "lock", internalType: "bool" },
    ],
    name: "warmupInfo",
    inputs: [{ type: "address", name: "", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "warmupPeriod",
    inputs: [],
  },
];
