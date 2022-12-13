export default [
  {
    inputs: [
      {
        internalType: "contract IGlpWrapperHarvestor",
        name: "_harvestor",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "ErrCauldronNotFound",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "_cauldron", type: "address" }],
    name: "getCaulronTargetApy",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "harvestor",
    outputs: [
      {
        internalType: "contract IGlpWrapperHarvestor",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
