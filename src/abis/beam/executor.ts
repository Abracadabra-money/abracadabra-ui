export default [
  {
    constant: true,
    inputs: [
      {
        name: "_dstEid",
        type: "uint32",
      },
    ],
    name: "dstConfig",
    outputs: [
      {
        name: "lzReceiveBaseGas",
        type: "uint64",
      },
      {
        name: "multiplierBps",
        type: "uint16",
      },
      {
        name: "floorMarginUSD",
        type: "uint128",
      },
      {
        name: "nativeCap",
        type: "uint128",
      },
      {
        name: "lzComposeBaseGas",
        type: "uint64",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];
