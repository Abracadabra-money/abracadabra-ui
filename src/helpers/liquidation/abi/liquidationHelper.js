export default [
  {
    inputs: [{ internalType: "contract ERC20", name: "_mim", type: "address" }],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "uint8", name: "cauldronVersion", type: "uint8" }],
    name: "ErrInvalidCauldronVersion",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "contract ICauldronV2",
        name: "cauldron",
        type: "address",
      },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "isLiquidatable",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "cauldron", type: "address" },
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "borrowPart", type: "uint256" },
      { internalType: "uint8", name: "cauldronVersion", type: "uint8" },
    ],
    name: "liquidate",
    outputs: [
      { internalType: "uint256", name: "collateralAmount", type: "uint256" },
      { internalType: "uint256", name: "adjustedBorrowPart", type: "uint256" },
      { internalType: "uint256", name: "requiredMimAmount", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "cauldron", type: "address" },
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint8", name: "cauldronVersion", type: "uint8" },
    ],
    name: "liquidateMax",
    outputs: [
      { internalType: "uint256", name: "collateralAmount", type: "uint256" },
      { internalType: "uint256", name: "adjustedBorrowPart", type: "uint256" },
      { internalType: "uint256", name: "requiredMimAmount", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "cauldron", type: "address" },
      { internalType: "address", name: "account", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint8", name: "cauldronVersion", type: "uint8" },
    ],
    name: "liquidateMaxTo",
    outputs: [
      { internalType: "uint256", name: "collateralAmount", type: "uint256" },
      { internalType: "uint256", name: "adjustedBorrowPart", type: "uint256" },
      { internalType: "uint256", name: "requiredMimAmount", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "cauldron", type: "address" },
      { internalType: "address", name: "account", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "borrowPart", type: "uint256" },
      { internalType: "uint8", name: "cauldronVersion", type: "uint8" },
    ],
    name: "liquidateTo",
    outputs: [
      { internalType: "uint256", name: "collateralAmount", type: "uint256" },
      { internalType: "uint256", name: "adjustedBorrowPart", type: "uint256" },
      { internalType: "uint256", name: "requiredMimAmount", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "mim",
    outputs: [{ internalType: "contract ERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ICauldronV2",
        name: "cauldron",
        type: "address",
      },
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "borrowPart", type: "uint256" },
    ],
    name: "previewLiquidation",
    outputs: [
      { internalType: "bool", name: "liquidatable", type: "bool" },
      { internalType: "uint256", name: "requiredMIMAmount", type: "uint256" },
      { internalType: "uint256", name: "adjustedBorrowPart", type: "uint256" },
      {
        internalType: "uint256",
        name: "returnedCollateralAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ICauldronV2",
        name: "cauldron",
        type: "address",
      },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "previewMaxLiquidation",
    outputs: [
      { internalType: "bool", name: "liquidatable", type: "bool" },
      { internalType: "uint256", name: "requiredMIMAmount", type: "uint256" },
      { internalType: "uint256", name: "adjustedBorrowPart", type: "uint256" },
      {
        internalType: "uint256",
        name: "returnedCollateralAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
