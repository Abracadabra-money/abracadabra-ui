export default [
  {
    "type": "function",
    "name": "availableSkim",
    "inputs": [
      {
        "name": "cauldron",
        "type": "address",
        "internalType": "contract ICauldronV2"
      }
    ],
    "outputs": [
      {
        "name": "share",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "availableSkim",
    "inputs": [],
    "outputs": [
      {
        "name": "share",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getBorrowFee",
    "inputs": [
      {
        "name": "cauldron",
        "type": "address",
        "internalType": "contract ICauldronV2"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCollateralPrice",
    "inputs": [
      {
        "name": "cauldron",
        "type": "address",
        "internalType": "contract ICauldronV2"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getHealthFactor",
    "inputs": [
      {
        "name": "cauldron",
        "type": "address",
        "internalType": "contract ICauldronV2"
      },
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "isStable",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getInterestPerYear",
    "inputs": [
      {
        "name": "cauldron",
        "type": "address",
        "internalType": "contract ICauldronV2"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getLiquidationFee",
    "inputs": [
      {
        "name": "cauldron",
        "type": "address",
        "internalType": "contract ICauldronV2"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMarketInfoCauldronV2",
    "inputs": [
      {
        "name": "cauldron",
        "type": "address",
        "internalType": "contract ICauldronV2"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct MarketLens.MarketInfo",
        "components": [
          {
            "name": "cauldron",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "borrowFee",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "maximumCollateralRatio",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "liquidationFee",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "interestPerYear",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "marketMaxBorrow",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "userMaxBorrow",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "totalBorrow",
            "type": "tuple",
            "internalType": "struct MarketLens.Borrow",
            "components": [
              {
                "name": "part",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "oracleExchangeRate",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "collateralPrice",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "totalCollateral",
            "type": "tuple",
            "internalType": "struct MarketLens.Collateral",
            "components": [
              {
                "name": "token",
                "type": "address",
                "internalType": "contract IERC20"
              },
              {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "share",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "value",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMarketInfoCauldronV3",
    "inputs": [
      {
        "name": "cauldron",
        "type": "address",
        "internalType": "contract ICauldronV3"
      }
    ],
    "outputs": [
      {
        "name": "marketInfo",
        "type": "tuple",
        "internalType": "struct MarketLens.MarketInfo",
        "components": [
          {
            "name": "cauldron",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "borrowFee",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "maximumCollateralRatio",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "liquidationFee",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "interestPerYear",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "marketMaxBorrow",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "userMaxBorrow",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "totalBorrow",
            "type": "tuple",
            "internalType": "struct MarketLens.Borrow",
            "components": [
              {
                "name": "part",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "oracleExchangeRate",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "collateralPrice",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "totalCollateral",
            "type": "tuple",
            "internalType": "struct MarketLens.Collateral",
            "components": [
              {
                "name": "token",
                "type": "address",
                "internalType": "contract IERC20"
              },
              {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "share",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "value",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMaxMarketBorrowForCauldronV2",
    "inputs": [
      {
        "name": "cauldron",
        "type": "address",
        "internalType": "contract ICauldronV2"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMaxMarketBorrowForCauldronV3",
    "inputs": [
      {
        "name": "cauldron",
        "type": "address",
        "internalType": "contract ICauldronV3"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMaxUserBorrowForCauldronV2",
    "inputs": [
      {
        "name": "cauldron",
        "type": "address",
        "internalType": "contract ICauldronV2"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMaxUserBorrowForCauldronV3",
    "inputs": [
      {
        "name": "cauldron",
        "type": "address",
        "internalType": "contract ICauldronV3"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMaximumCollateralRatio",
    "inputs": [
      {
        "name": "cauldron",
        "type": "address",
        "internalType": "contract ICauldronV2"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getOracleExchangeRate",
    "inputs": [
      {
        "name": "cauldron",
        "type": "address",
        "internalType": "contract ICauldronV2"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTokenInBentoBox",
    "inputs": [
      {
        "name": "bentoBox",
        "type": "address",
        "internalType": "contract IBentoBoxV1"
      },
      {
        "name": "token",
        "type": "address",
        "internalType": "contract IERC20"
      },
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "share",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTotalBorrowed",
    "inputs": [
      {
        "name": "cauldron",
        "type": "address",
        "internalType": "contract ICauldronV2"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct MarketLens.Borrow",
        "components": [
          {
            "name": "part",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "amount",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTotalCollateral",
    "inputs": [
      {
        "name": "cauldron",
        "type": "address",
        "internalType": "contract ICauldronV2"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct MarketLens.Collateral",
        "components": [
          {
            "name": "token",
            "type": "address",
            "internalType": "contract IERC20"
          },
          {
            "name": "amount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "share",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "value",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserBorrow",
    "inputs": [
      {
        "name": "cauldron",
        "type": "address",
        "internalType": "contract ICauldronV2"
      },
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct MarketLens.Borrow",
        "components": [
          {
            "name": "part",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "amount",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserCollateral",
    "inputs": [
      {
        "name": "cauldron",
        "type": "address",
        "internalType": "contract ICauldronV2"
      },
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct MarketLens.Collateral",
        "components": [
          {
            "name": "token",
            "type": "address",
            "internalType": "contract IERC20"
          },
          {
            "name": "amount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "share",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "value",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserLiquidationPrice",
    "inputs": [
      {
        "name": "cauldron",
        "type": "address",
        "internalType": "contract ICauldronV2"
      },
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "liquidationPrice",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserLtv",
    "inputs": [
      {
        "name": "cauldron",
        "type": "address",
        "internalType": "contract ICauldronV2"
      },
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "ltvBps",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserMaxBorrow",
    "inputs": [
      {
        "name": "cauldron",
        "type": "address",
        "internalType": "contract ICauldronV2"
      },
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserPosition",
    "inputs": [
      {
        "name": "cauldron",
        "type": "address",
        "internalType": "contract ICauldronV2"
      },
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct MarketLens.UserPosition",
        "components": [
          {
            "name": "cauldron",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "account",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "ltvBps",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "healthFactor",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "borrow",
            "type": "tuple",
            "internalType": "struct MarketLens.Borrow",
            "components": [
              {
                "name": "part",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "collateral",
            "type": "tuple",
            "internalType": "struct MarketLens.Collateral",
            "components": [
              {
                "name": "token",
                "type": "address",
                "internalType": "contract IERC20"
              },
              {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "share",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "value",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "liquidationPrice",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserPositions",
    "inputs": [
      {
        "name": "cauldron",
        "type": "address",
        "internalType": "contract ICauldronV2"
      },
      {
        "name": "accounts",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "outputs": [
      {
        "name": "positions",
        "type": "tuple[]",
        "internalType": "struct MarketLens.UserPosition[]",
        "components": [
          {
            "name": "cauldron",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "account",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "ltvBps",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "healthFactor",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "borrow",
            "type": "tuple",
            "internalType": "struct MarketLens.Borrow",
            "components": [
              {
                "name": "part",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "collateral",
            "type": "tuple",
            "internalType": "struct MarketLens.Collateral",
            "components": [
              {
                "name": "token",
                "type": "address",
                "internalType": "contract IERC20"
              },
              {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "share",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "value",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "liquidationPrice",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  }
] as const;
