export default [
  {
    inputs: [
      {
        internalType: "contract IWETH",
        name: "_wBera",
        type: "address",
      },
      {
        internalType: "address",
        name: "_kodiakRouter",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "contract IKodiakIsland",
        name: "island",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount0Max",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1Max",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount0Min",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1Min",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountSharesMin",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "addLiquidity",
    outputs: [
      {
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "mintAmount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IKodiakIsland",
        name: "island",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount0Max",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1Max",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount0Min",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1Min",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountSharesMin",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "addLiquidityNative",
    outputs: [
      {
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "mintAmount",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IKodiakIsland",
        name: "island",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "totalAmountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountSharesMin",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxStakingSlippageBPS",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "amountIn",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minAmountOut",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "zeroForOne",
            type: "bool",
          },
          {
            internalType: "bytes",
            name: "routeData",
            type: "bytes",
          },
        ],
        internalType: "struct RouterSwapParams",
        name: "swapData",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "addLiquiditySingle",
    outputs: [
      {
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "mintAmount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IKodiakIsland",
        name: "island",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountSharesMin",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxStakingSlippageBPS",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "amountIn",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minAmountOut",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "zeroForOne",
            type: "bool",
          },
          {
            internalType: "bytes",
            name: "routeData",
            type: "bytes",
          },
        ],
        internalType: "struct RouterSwapParams",
        name: "swapData",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "addLiquiditySingleNative",
    outputs: [
      {
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "mintAmount",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "kodiakRouter",
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
        internalType: "contract IKodiakIsland",
        name: "island",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "burnAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount0Min",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1Min",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "removeLiquidity",
    outputs: [
      {
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
      {
        internalType: "uint128",
        name: "liquidityBurned",
        type: "uint128",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IKodiakIsland",
        name: "island",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "burnAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount0Min",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1Min",
        type: "uint256",
      },
      {
        internalType: "address payable",
        name: "receiver",
        type: "address",
      },
    ],
    name: "removeLiquidityNative",
    outputs: [
      {
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
      {
        internalType: "uint128",
        name: "liquidityBurned",
        type: "uint128",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "wBera",
    outputs: [
      {
        internalType: "contract IWETH",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;
