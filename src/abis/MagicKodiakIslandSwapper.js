export default [
  {
    inputs: [
      { internalType: "contract IBentoBoxLite", name: "_box", type: "address" },
      { internalType: "address", name: "_magicKodiakVault", type: "address" },
      { internalType: "address", name: "_mim", type: "address" },
      {
        internalType: "contract IKodiakV1RouterStaking",
        name: "_kodiakRouter",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "address", name: "target", type: "address" }],
    name: "AddressEmptyCode",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "AddressInsufficientBalance",
    type: "error",
  },
  { inputs: [], name: "FailedInnerCall", type: "error" },
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
    name: "kodiakRouter",
    outputs: [
      {
        internalType: "contract IKodiakV1RouterStaking",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "kodiakVault",
    outputs: [
      { internalType: "contract IKodiakVaultV1", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "magicKodiakVault",
    outputs: [{ internalType: "contract IERC4626", name: "", type: "address" }],
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
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
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
    name: "token0",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token1",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
];
