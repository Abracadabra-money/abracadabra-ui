export default [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_defaultExchangeRate",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_oft",
        type: "address",
      },
      {
        internalType: "address",
        name: "_aggregator",
        type: "address",
      },
      {
        internalType: "address",
        name: "_multisig",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ErrWithdrawFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAddress",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "enum IOFTWrapper.QUOTE_TYPE",
        name: "",
        type: "uint8",
      },
    ],
    name: "InvalidQuoteType",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "MassageValueIsLow",
    type: "error",
  },
  {
    inputs: [],
    name: "NotAllowedOperator",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldExchangeRate",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newExchangeRate",
        type: "uint256",
      },
    ],
    name: "LogDefaultExchangeRateChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum IOFTWrapper.QUOTE_TYPE",
        name: "oldValue",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "enum IOFTWrapper.QUOTE_TYPE",
        name: "newValue",
        type: "uint8",
      },
    ],
    name: "LogDefaultQuoteTypeChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "oldAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newAddress",
        type: "address",
      },
    ],
    name: "LogFeeToChange",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IAggregator",
        name: "oldOracle",
        type: "address",
      },
      {
        indexed: true,
        internalType: "contract IAggregator",
        name: "newOracle",
        type: "address",
      },
    ],
    name: "LogOracleImplementationChange",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "LogWrapperFeeWithdrawn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    name: "OperatorChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
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
    name: "aggregator",
    outputs: [
      {
        internalType: "contract IAggregator",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "defaultExchangeRate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "defaultQuoteType",
    outputs: [
      {
        internalType: "enum IOFTWrapper.QUOTE_TYPE",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_dstChainId",
        type: "uint16",
      },
      {
        internalType: "bytes32",
        name: "_toAddress",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_adapterParams",
        type: "bytes",
      },
    ],
    name: "estimateSendFeeV2",
    outputs: [
      {
        internalType: "uint256",
        name: "nativeFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "zroFee",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "feeTo",
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
    name: "lzEndpoint",
    outputs: [
      {
        internalType: "contract ILzEndpoint",
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
        internalType: "uint16",
        name: "_srcChainId",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "_dstChainId",
        type: "uint16",
      },
    ],
    name: "minDstGasLookup",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "oft",
    outputs: [
      {
        internalType: "contract ILzOFTV2",
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
        name: "",
        type: "address",
      },
    ],
    name: "operators",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
        internalType: "uint16",
        name: "_dstChainId",
        type: "uint16",
      },
      {
        internalType: "bytes32",
        name: "_toAddress",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "address payable",
            name: "refundAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "zroPaymentAddress",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "adapterParams",
            type: "bytes",
          },
        ],
        internalType: "struct ILzCommonOFT.LzCallParams",
        name: "_callParams",
        type: "tuple",
      },
    ],
    name: "sendOFTV2",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_dstChainId",
        type: "uint16",
      },
      {
        internalType: "bytes32",
        name: "_toAddress",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "address payable",
            name: "refundAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "zroPaymentAddress",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "adapterParams",
            type: "bytes",
          },
        ],
        internalType: "struct ILzCommonOFT.LzCallParams",
        name: "_callParams",
        type: "tuple",
      },
    ],
    name: "sendProxyOFTV2",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IAggregator",
        name: "_aggregator",
        type: "address",
      },
    ],
    name: "setAggregator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_defaultExchangeRate",
        type: "uint256",
      },
    ],
    name: "setDefaultExchangeRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum IOFTWrapper.QUOTE_TYPE",
        name: "_quoteType",
        type: "uint8",
      },
    ],
    name: "setDefaultQuoteType",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_feeTo",
        type: "address",
      },
    ],
    name: "setFeeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "status",
        type: "bool",
      },
    ],
    name: "setOperator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [
      {
        internalType: "contract IERC20",
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
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
