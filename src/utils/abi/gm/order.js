export default [
  {
    inputs: [
      {
        internalType: "contract IBentoBoxV1",
        name: "_degenBox",
        type: "address",
      },
      {
        internalType: "contract IGmxV2ExchangeRouter",
        name: "_gmxRouter",
        type: "address",
      },
      { internalType: "address", name: "_syntheticsRouter", type: "address" },
      {
        internalType: "contract IGmxReader",
        name: "_gmxReader",
        type: "address",
      },
      { internalType: "contract IWETH", name: "_weth", type: "address" },
      { internalType: "address", name: "_refundTo", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "ErrAlreadyInitialized", type: "error" },
  { inputs: [], name: "ErrFinalized", type: "error" },
  { inputs: [], name: "ErrIncorrectInitialization", type: "error" },
  { inputs: [], name: "ErrMinOutTooLarge", type: "error" },
  { inputs: [], name: "ErrNotOwner", type: "error" },
  { inputs: [], name: "ErrUnauthorized", type: "error" },
  { inputs: [], name: "ErrWrongUser", type: "error" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "LogRefundWETH",
    type: "event",
  },
  {
    inputs: [],
    name: "DATASTORE",
    outputs: [
      { internalType: "contract IGmxDataStore", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEPOSIT_LIST",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEPOSIT_VAULT",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "GMX_READER",
    outputs: [
      { internalType: "contract IGmxReader", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "GMX_ROUTER",
    outputs: [
      {
        internalType: "contract IGmxV2ExchangeRouter",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ORDER_KEEPER",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "REFUND_TO",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SYNTHETICS_ROUTER",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "WETH",
    outputs: [{ internalType: "contract IWETH", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "WITHDRAWAL_LIST",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "WITHDRAWAL_VAULT",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "key", type: "bytes32" },
      {
        components: [
          {
            components: [
              { internalType: "address", name: "account", type: "address" },
              { internalType: "address", name: "receiver", type: "address" },
              {
                internalType: "address",
                name: "callbackContract",
                type: "address",
              },
              {
                internalType: "address",
                name: "uiFeeReceiver",
                type: "address",
              },
              { internalType: "address", name: "market", type: "address" },
              {
                internalType: "address",
                name: "initialLongToken",
                type: "address",
              },
              {
                internalType: "address",
                name: "initialShortToken",
                type: "address",
              },
              {
                internalType: "address[]",
                name: "longTokenSwapPath",
                type: "address[]",
              },
              {
                internalType: "address[]",
                name: "shortTokenSwapPath",
                type: "address[]",
              },
            ],
            internalType: "struct IGmxV2Deposit.Addresses",
            name: "addresses",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "initialLongTokenAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "initialShortTokenAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "minMarketTokens",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "updatedAtBlock",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "executionFee",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "callbackGasLimit",
                type: "uint256",
              },
            ],
            internalType: "struct IGmxV2Deposit.Numbers",
            name: "numbers",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "bool",
                name: "shouldUnwrapNativeToken",
                type: "bool",
              },
            ],
            internalType: "struct IGmxV2Deposit.Flags",
            name: "flags",
            type: "tuple",
          },
        ],
        internalType: "struct IGmxV2Deposit.Props",
        name: "deposit",
        type: "tuple",
      },
      {
        components: [
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "address", name: "value", type: "address" },
                ],
                internalType: "struct IGmxV2EventUtils.AddressKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  {
                    internalType: "address[]",
                    name: "value",
                    type: "address[]",
                  },
                ],
                internalType: "struct IGmxV2EventUtils.AddressArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.AddressItems",
            name: "addressItems",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "uint256", name: "value", type: "uint256" },
                ],
                internalType: "struct IGmxV2EventUtils.UintKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  {
                    internalType: "uint256[]",
                    name: "value",
                    type: "uint256[]",
                  },
                ],
                internalType: "struct IGmxV2EventUtils.UintArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.UintItems",
            name: "uintItems",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "int256", name: "value", type: "int256" },
                ],
                internalType: "struct IGmxV2EventUtils.IntKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "int256[]", name: "value", type: "int256[]" },
                ],
                internalType: "struct IGmxV2EventUtils.IntArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.IntItems",
            name: "intItems",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "bool", name: "value", type: "bool" },
                ],
                internalType: "struct IGmxV2EventUtils.BoolKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "bool[]", name: "value", type: "bool[]" },
                ],
                internalType: "struct IGmxV2EventUtils.BoolArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.BoolItems",
            name: "boolItems",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "bytes32", name: "value", type: "bytes32" },
                ],
                internalType: "struct IGmxV2EventUtils.Bytes32KeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  {
                    internalType: "bytes32[]",
                    name: "value",
                    type: "bytes32[]",
                  },
                ],
                internalType: "struct IGmxV2EventUtils.Bytes32ArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.Bytes32Items",
            name: "bytes32Items",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "bytes", name: "value", type: "bytes" },
                ],
                internalType: "struct IGmxV2EventUtils.BytesKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "bytes[]", name: "value", type: "bytes[]" },
                ],
                internalType: "struct IGmxV2EventUtils.BytesArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.BytesItems",
            name: "bytesItems",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "string", name: "value", type: "string" },
                ],
                internalType: "struct IGmxV2EventUtils.StringKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "string[]", name: "value", type: "string[]" },
                ],
                internalType: "struct IGmxV2EventUtils.StringArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.StringItems",
            name: "stringItems",
            type: "tuple",
          },
        ],
        internalType: "struct IGmxV2EventUtils.EventLogData",
        name: "eventData",
        type: "tuple",
      },
    ],
    name: "afterDepositCancellation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "", type: "bytes32" },
      {
        components: [
          {
            components: [
              { internalType: "address", name: "account", type: "address" },
              { internalType: "address", name: "receiver", type: "address" },
              {
                internalType: "address",
                name: "callbackContract",
                type: "address",
              },
              {
                internalType: "address",
                name: "uiFeeReceiver",
                type: "address",
              },
              { internalType: "address", name: "market", type: "address" },
              {
                internalType: "address",
                name: "initialLongToken",
                type: "address",
              },
              {
                internalType: "address",
                name: "initialShortToken",
                type: "address",
              },
              {
                internalType: "address[]",
                name: "longTokenSwapPath",
                type: "address[]",
              },
              {
                internalType: "address[]",
                name: "shortTokenSwapPath",
                type: "address[]",
              },
            ],
            internalType: "struct IGmxV2Deposit.Addresses",
            name: "addresses",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "initialLongTokenAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "initialShortTokenAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "minMarketTokens",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "updatedAtBlock",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "executionFee",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "callbackGasLimit",
                type: "uint256",
              },
            ],
            internalType: "struct IGmxV2Deposit.Numbers",
            name: "numbers",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "bool",
                name: "shouldUnwrapNativeToken",
                type: "bool",
              },
            ],
            internalType: "struct IGmxV2Deposit.Flags",
            name: "flags",
            type: "tuple",
          },
        ],
        internalType: "struct IGmxV2Deposit.Props",
        name: "deposit",
        type: "tuple",
      },
      {
        components: [
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "address", name: "value", type: "address" },
                ],
                internalType: "struct IGmxV2EventUtils.AddressKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  {
                    internalType: "address[]",
                    name: "value",
                    type: "address[]",
                  },
                ],
                internalType: "struct IGmxV2EventUtils.AddressArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.AddressItems",
            name: "addressItems",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "uint256", name: "value", type: "uint256" },
                ],
                internalType: "struct IGmxV2EventUtils.UintKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  {
                    internalType: "uint256[]",
                    name: "value",
                    type: "uint256[]",
                  },
                ],
                internalType: "struct IGmxV2EventUtils.UintArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.UintItems",
            name: "uintItems",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "int256", name: "value", type: "int256" },
                ],
                internalType: "struct IGmxV2EventUtils.IntKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "int256[]", name: "value", type: "int256[]" },
                ],
                internalType: "struct IGmxV2EventUtils.IntArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.IntItems",
            name: "intItems",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "bool", name: "value", type: "bool" },
                ],
                internalType: "struct IGmxV2EventUtils.BoolKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "bool[]", name: "value", type: "bool[]" },
                ],
                internalType: "struct IGmxV2EventUtils.BoolArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.BoolItems",
            name: "boolItems",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "bytes32", name: "value", type: "bytes32" },
                ],
                internalType: "struct IGmxV2EventUtils.Bytes32KeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  {
                    internalType: "bytes32[]",
                    name: "value",
                    type: "bytes32[]",
                  },
                ],
                internalType: "struct IGmxV2EventUtils.Bytes32ArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.Bytes32Items",
            name: "bytes32Items",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "bytes", name: "value", type: "bytes" },
                ],
                internalType: "struct IGmxV2EventUtils.BytesKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "bytes[]", name: "value", type: "bytes[]" },
                ],
                internalType: "struct IGmxV2EventUtils.BytesArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.BytesItems",
            name: "bytesItems",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "string", name: "value", type: "string" },
                ],
                internalType: "struct IGmxV2EventUtils.StringKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "string[]", name: "value", type: "string[]" },
                ],
                internalType: "struct IGmxV2EventUtils.StringArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.StringItems",
            name: "stringItems",
            type: "tuple",
          },
        ],
        internalType: "struct IGmxV2EventUtils.EventLogData",
        name: "",
        type: "tuple",
      },
    ],
    name: "afterDepositExecution",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "", type: "bytes32" },
      {
        components: [
          {
            components: [
              { internalType: "address", name: "account", type: "address" },
              { internalType: "address", name: "receiver", type: "address" },
              {
                internalType: "address",
                name: "callbackContract",
                type: "address",
              },
              {
                internalType: "address",
                name: "uiFeeReceiver",
                type: "address",
              },
              { internalType: "address", name: "market", type: "address" },
              {
                internalType: "address[]",
                name: "longTokenSwapPath",
                type: "address[]",
              },
              {
                internalType: "address[]",
                name: "shortTokenSwapPath",
                type: "address[]",
              },
            ],
            internalType: "struct IGmxV2Withdrawal.Addresses",
            name: "addresses",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "marketTokenAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "minLongTokenAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "minShortTokenAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "updatedAtBlock",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "executionFee",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "callbackGasLimit",
                type: "uint256",
              },
            ],
            internalType: "struct IGmxV2Withdrawal.Numbers",
            name: "numbers",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "bool",
                name: "shouldUnwrapNativeToken",
                type: "bool",
              },
            ],
            internalType: "struct IGmxV2Withdrawal.Flags",
            name: "flags",
            type: "tuple",
          },
        ],
        internalType: "struct IGmxV2Withdrawal.Props",
        name: "withdrawal",
        type: "tuple",
      },
      {
        components: [
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "address", name: "value", type: "address" },
                ],
                internalType: "struct IGmxV2EventUtils.AddressKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  {
                    internalType: "address[]",
                    name: "value",
                    type: "address[]",
                  },
                ],
                internalType: "struct IGmxV2EventUtils.AddressArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.AddressItems",
            name: "addressItems",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "uint256", name: "value", type: "uint256" },
                ],
                internalType: "struct IGmxV2EventUtils.UintKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  {
                    internalType: "uint256[]",
                    name: "value",
                    type: "uint256[]",
                  },
                ],
                internalType: "struct IGmxV2EventUtils.UintArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.UintItems",
            name: "uintItems",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "int256", name: "value", type: "int256" },
                ],
                internalType: "struct IGmxV2EventUtils.IntKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "int256[]", name: "value", type: "int256[]" },
                ],
                internalType: "struct IGmxV2EventUtils.IntArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.IntItems",
            name: "intItems",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "bool", name: "value", type: "bool" },
                ],
                internalType: "struct IGmxV2EventUtils.BoolKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "bool[]", name: "value", type: "bool[]" },
                ],
                internalType: "struct IGmxV2EventUtils.BoolArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.BoolItems",
            name: "boolItems",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "bytes32", name: "value", type: "bytes32" },
                ],
                internalType: "struct IGmxV2EventUtils.Bytes32KeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  {
                    internalType: "bytes32[]",
                    name: "value",
                    type: "bytes32[]",
                  },
                ],
                internalType: "struct IGmxV2EventUtils.Bytes32ArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.Bytes32Items",
            name: "bytes32Items",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "bytes", name: "value", type: "bytes" },
                ],
                internalType: "struct IGmxV2EventUtils.BytesKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "bytes[]", name: "value", type: "bytes[]" },
                ],
                internalType: "struct IGmxV2EventUtils.BytesArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.BytesItems",
            name: "bytesItems",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "string", name: "value", type: "string" },
                ],
                internalType: "struct IGmxV2EventUtils.StringKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "string[]", name: "value", type: "string[]" },
                ],
                internalType: "struct IGmxV2EventUtils.StringArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.StringItems",
            name: "stringItems",
            type: "tuple",
          },
        ],
        internalType: "struct IGmxV2EventUtils.EventLogData",
        name: "",
        type: "tuple",
      },
    ],
    name: "afterWithdrawalCancellation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "key", type: "bytes32" },
      {
        components: [
          {
            components: [
              { internalType: "address", name: "account", type: "address" },
              { internalType: "address", name: "receiver", type: "address" },
              {
                internalType: "address",
                name: "callbackContract",
                type: "address",
              },
              {
                internalType: "address",
                name: "uiFeeReceiver",
                type: "address",
              },
              { internalType: "address", name: "market", type: "address" },
              {
                internalType: "address[]",
                name: "longTokenSwapPath",
                type: "address[]",
              },
              {
                internalType: "address[]",
                name: "shortTokenSwapPath",
                type: "address[]",
              },
            ],
            internalType: "struct IGmxV2Withdrawal.Addresses",
            name: "addresses",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "marketTokenAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "minLongTokenAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "minShortTokenAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "updatedAtBlock",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "executionFee",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "callbackGasLimit",
                type: "uint256",
              },
            ],
            internalType: "struct IGmxV2Withdrawal.Numbers",
            name: "numbers",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "bool",
                name: "shouldUnwrapNativeToken",
                type: "bool",
              },
            ],
            internalType: "struct IGmxV2Withdrawal.Flags",
            name: "flags",
            type: "tuple",
          },
        ],
        internalType: "struct IGmxV2Withdrawal.Props",
        name: "withdrawal",
        type: "tuple",
      },
      {
        components: [
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "address", name: "value", type: "address" },
                ],
                internalType: "struct IGmxV2EventUtils.AddressKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  {
                    internalType: "address[]",
                    name: "value",
                    type: "address[]",
                  },
                ],
                internalType: "struct IGmxV2EventUtils.AddressArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.AddressItems",
            name: "addressItems",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "uint256", name: "value", type: "uint256" },
                ],
                internalType: "struct IGmxV2EventUtils.UintKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  {
                    internalType: "uint256[]",
                    name: "value",
                    type: "uint256[]",
                  },
                ],
                internalType: "struct IGmxV2EventUtils.UintArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.UintItems",
            name: "uintItems",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "int256", name: "value", type: "int256" },
                ],
                internalType: "struct IGmxV2EventUtils.IntKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "int256[]", name: "value", type: "int256[]" },
                ],
                internalType: "struct IGmxV2EventUtils.IntArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.IntItems",
            name: "intItems",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "bool", name: "value", type: "bool" },
                ],
                internalType: "struct IGmxV2EventUtils.BoolKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "bool[]", name: "value", type: "bool[]" },
                ],
                internalType: "struct IGmxV2EventUtils.BoolArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.BoolItems",
            name: "boolItems",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "bytes32", name: "value", type: "bytes32" },
                ],
                internalType: "struct IGmxV2EventUtils.Bytes32KeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  {
                    internalType: "bytes32[]",
                    name: "value",
                    type: "bytes32[]",
                  },
                ],
                internalType: "struct IGmxV2EventUtils.Bytes32ArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.Bytes32Items",
            name: "bytes32Items",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "bytes", name: "value", type: "bytes" },
                ],
                internalType: "struct IGmxV2EventUtils.BytesKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "bytes[]", name: "value", type: "bytes[]" },
                ],
                internalType: "struct IGmxV2EventUtils.BytesArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.BytesItems",
            name: "bytesItems",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "string", name: "value", type: "string" },
                ],
                internalType: "struct IGmxV2EventUtils.StringKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "string", name: "key", type: "string" },
                  { internalType: "string[]", name: "value", type: "string[]" },
                ],
                internalType: "struct IGmxV2EventUtils.StringArrayKeyValue[]",
                name: "arrayItems",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGmxV2EventUtils.StringItems",
            name: "stringItems",
            type: "tuple",
          },
        ],
        internalType: "struct IGmxV2EventUtils.EventLogData",
        name: "eventData",
        type: "tuple",
      },
    ],
    name: "afterWithdrawalExecution",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "cancelOrder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "cauldron",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
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
    inputs: [],
    name: "depositType",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getExchangeRates",
    outputs: [
      { internalType: "uint256", name: "shortExchangeRate", type: "uint256" },
      { internalType: "uint256", name: "marketExchangeRate", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_cauldron", type: "address" },
      { internalType: "address", name: "_user", type: "address" },
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
    name: "init",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "inputAmount",
    outputs: [{ internalType: "uint128", name: "", type: "uint128" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isActive",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isHomogenousMarket",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "market",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minOut",
    outputs: [{ internalType: "uint128", name: "", type: "uint128" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minOutLong",
    outputs: [{ internalType: "uint128", name: "", type: "uint128" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "oracle",
    outputs: [{ internalType: "contract IOracle", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "oracleDecimalScale",
    outputs: [{ internalType: "uint128", name: "", type: "uint128" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "orderAgent",
    outputs: [
      {
        internalType: "contract IGmCauldronOrderAgent",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "orderKey",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "orderValueInCollateral",
    outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "shareMarketToken", type: "uint256" },
    ],
    name: "sendValueInCollateral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "shortToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "user",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bool", name: "closeOrder", type: "bool" },
    ],
    name: "withdrawFromOrder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
];
