export default [
  {
    inputs: [
      {
        internalType: "contract IBentoBoxV1",
        name: "_degenBox",
        type: "address",
      },
      {
        internalType: "address",
        name: "_orderImplementation",
        type: "address",
      },
      { internalType: "address", name: "_owner", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "ErrInvalidParams", type: "error" },
  { inputs: [], name: "NotAllowedOperator", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "previous",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "current",
        type: "uint256",
      },
    ],
    name: "LogCallbackGasLimit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "order",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        components: [
          { internalType: "address", name: "inputToken", type: "address" },
          { internalType: "bool", name: "deposit", type: "bool" },
          { internalType: "uint128", name: "inputAmount", type: "uint128" },
          { internalType: "uint128", name: "executionFee", type: "uint128" },
          { internalType: "uint128", name: "minOutput", type: "uint128" },
          { internalType: "uint128", name: "minOutLong", type: "uint128" },
        ],
        indexed: false,
        internalType: "struct GmRouterOrderParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "LogOrderCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "market",
        type: "address",
      },
      {
        indexed: true,
        internalType: "contract IOracle",
        name: "oracle",
        type: "address",
      },
    ],
    name: "LogSetOracle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "", type: "address" },
      { indexed: false, internalType: "bool", name: "", type: "bool" },
    ],
    name: "OperatorChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "callbackGasLimit",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      {
        components: [
          { internalType: "address", name: "inputToken", type: "address" },
          { internalType: "bool", name: "deposit", type: "bool" },
          { internalType: "uint128", name: "inputAmount", type: "uint128" },
          { internalType: "uint128", name: "executionFee", type: "uint128" },
          { internalType: "uint128", name: "minOutput", type: "uint128" },
          { internalType: "uint128", name: "minOutLong", type: "uint128" },
        ],
        internalType: "struct GmRouterOrderParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "createOrder",
    outputs: [{ internalType: "address", name: "order", type: "address" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "degenBox",
    outputs: [
      { internalType: "contract IBentoBoxV1", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "operators",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "oracles",
    outputs: [{ internalType: "contract IOracle", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "orderImplementation",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_callbackGasLimit", type: "uint256" },
    ],
    name: "setCallbackGasLimit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "status", type: "bool" },
    ],
    name: "setOperator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "market", type: "address" },
      { internalType: "contract IOracle", name: "oracle", type: "address" },
    ],
    name: "setOracle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
