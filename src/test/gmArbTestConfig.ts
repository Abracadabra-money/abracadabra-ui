import { BigNumber, utils } from "ethers";

export const gmArbTestConfig = {
  config: {
    icon: "http://localhost:5173/src/assets/images/tokens/GM_ARB.png",
    name: "GM (ARB)",
    chainId: 42161,
    id: 4,
    liquidationFee: 6,
    mcr: 75,
    borrowFee: 1,
    version: 4,
    cauldronSettings: {
      isNew: true,
      isSwappersActive: true,
      isDegenBox: true,
      strategyLink: false,
      isDepreciated: false,
      acceptUseDefaultBalance: false,
      healthMultiplier: 1,
      hasAccountBorrowLimit: false,
      hasWithdrawableLimit: false,
      localBorrowAmountLimit: false,
      hasCrvClaimLogic: false,
      isGMXMarket: true,
    },
    contract: {
      name: "CauldronV4",
      address: "0x4F9737E994da9811B8830775Fd73E2F1C8e40741",
      abi: [],
    },
    collateralInfo: {
      name: "GM (ARB)",
      decimals: 18,
      address: "0xC25cEf6061Cf5dE5eb761b50E4743c1F5D7E5407",
      abi: [],
    },
    mimInfo: {
      name: "MIM",
      icon: "http://localhost:5173/src/assets/images/tokens/MIM.png",
      decimals: 18,
      address: "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
      abi: [],
    },
    leverageInfo: {
      address: "0x4B4C275A5BBBb68a4DCC99C7C47be3ec04108940",
      abi: [],
    },
    deleverageInfo: {
      address: "0xab0fbe08b8d41508e6a8bbd5f9046d4246992116",
      abi: [],
    },
  },
  contracts: {
    cauldron: {},
    bentoBox: {},
    collateral: {},
    mim: {},
    leverageSwapper: {},
    liquidationSwapper: {},
    unwrappedToken: null,
    wrapper: null,
  },
  mainParams: {
    borrowFee: 1,
    interest: 4.19,
    liquidationFee: 6,
    collateralPrice: utils.parseUnits("1.34", 18),
    mimLeftToBorrow: BigNumber.from("0"),
    maximumCollateralRatio: utils.parseUnits("75", 18),
    oracleExchangeRate: utils.parseUnits("0.74", 18),
    totalBorrowed: utils.parseUnits("1000", 18),
    tvl: utils.parseUnits("1000000", 18),
    userMaxBorrow: BigNumber.from("0"),
    updatePrice: true,
  },
  userPosition: {
    collateralInfo: {
      userCollateralShare: utils.parseUnits("1", 18),
      userCollateralAmount: utils.parseUnits("1", 18),
    },
    borrowInfo: {
      userBorrowAmount: utils.parseUnits("0.5", 18),
      userBorrowPart: utils.parseUnits("0.5", 18),
    },
    oracleRate: utils.parseUnits("0.74", 18),
    liquidationPrice: 0.7783060324347315,
    positionHealth: 42.00722052056243,
    collateralDeposited: 0.9245417223276207,
    collateralDepositedUsd: 1.2408034348143684,
    mimBorrowed: 0.5396822997938877,
    hasActiveGmOrder: false,
    userTokensInfo: {
      collateralBalance: utils.parseUnits("120", 18),
      mimBalance: utils.parseUnits("100", 18),
      nativeTokenBalance: utils.parseUnits("1", 18),
      collateralAllowance: utils.parseUnits("120", 18),
      mimAllowance: utils.parseUnits("100", 18),
      unwrappedTokenBalance: BigNumber.from("0"),
      unwrappedTokenAllowance: BigNumber.from("0"),
    },
  },
  additionalInfo: {
    isMasterContractApproved: true,
    tokensRate: utils.parseUnits("1", 18),
    maxWithdrawAmount: BigNumber.from("0"),
    whitelistedInfo: null,
    isCollateralLocked: false,
    feePercent: null,
    gmInfo: {
      marketInfo: {
        marketToken: "0xC25cEf6061Cf5dE5eb761b50E4743c1F5D7E5407",
        indexToken: "0x912CE59144191C1204E64559FE8253a0e49E6548",
        longToken: "0x912CE59144191C1204E64559FE8253a0e49E6548",
        shortToken: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      },
      marketFullInfo: {
        market: "0xC25cEf6061Cf5dE5eb761b50E4743c1F5D7E5407",
        parsedPrices: {
          indexTokenPrice: {
            min: {
              type: "BigNumber",
              hex: "0x166716e311dad41256b9000000",
            },
            max: {
              type: "BigNumber",
              hex: "0x166b7ed6b81371390365400000",
            },
          },
          longTokenPrice: {
            min: {
              type: "BigNumber",
              hex: "0x166716e311dad41256b9000000",
            },
            max: {
              type: "BigNumber",
              hex: "0x166b7ed6b81371390365400000",
            },
          },
          shortTokenPrice: {
            min: {
              type: "BigNumber",
              hex: "0x0c9f6f98fedf2231a4cc800000",
            },
            max: {
              type: "BigNumber",
              hex: "0x0c9fb84e8b6b70c2092e000000",
            },
          },
        },
        marketInfo: [
          [
            "0xC25cEf6061Cf5dE5eb761b50E4743c1F5D7E5407",
            "0x912CE59144191C1204E64559FE8253a0e49E6548",
            "0x912CE59144191C1204E64559FE8253a0e49E6548",
            "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
          ],
          {
            type: "BigNumber",
            hex: "0xa1c8f71efa6e9f6252",
          },
          {
            type: "BigNumber",
            hex: "0x00",
          },
          [
            [
              [
                {
                  type: "BigNumber",
                  hex: "0x063dc86fc84f8b73936700066c94",
                },
                {
                  type: "BigNumber",
                  hex: "0x07fab887d43540b7b6",
                },
              ],
              [
                {
                  type: "BigNumber",
                  hex: "0x0b4d4546ba7eab220f6b7227c9",
                },
                {
                  type: "BigNumber",
                  hex: "0x0af8fb23bc78c4cc",
                },
              ],
            ],
            [
              [
                {
                  type: "BigNumber",
                  hex: "0x063dc86fc84f8b73936700066c94",
                },
                {
                  type: "BigNumber",
                  hex: "0x07fab887d43540b7b6",
                },
              ],
              [
                {
                  type: "BigNumber",
                  hex: "0x0b4d4546ba7eab220f6b7227c9",
                },
                {
                  type: "BigNumber",
                  hex: "0x0af8fb23bc78c4cc",
                },
              ],
            ],
          ],
          [
            true,
            {
              type: "BigNumber",
              hex: "0x012970cc1f60f005d3e5",
            },
            {
              type: "BigNumber",
              hex: "0x012970cc1f60f005d3e5",
            },
            [
              [
                {
                  type: "BigNumber",
                  hex: "0x051c355fe87463f068846a",
                },
                {
                  type: "BigNumber",
                  hex: "0x09fa9062f8d1",
                },
              ],
              [
                {
                  type: "BigNumber",
                  hex: "0x00",
                },
                {
                  type: "BigNumber",
                  hex: "0x00",
                },
              ],
            ],
            [
              [
                {
                  type: "BigNumber",
                  hex: "0x00",
                },
                {
                  type: "BigNumber",
                  hex: "0x00",
                },
              ],
              [
                {
                  type: "BigNumber",
                  hex: "0x7c196cca8ab5045e225e",
                },
                {
                  type: "BigNumber",
                  hex: "0x0992993b0fd3",
                },
              ],
            ],
          ],
          [
            {
              type: "BigNumber",
              hex: "0x04747aed1ecf02bcd8cdd8",
            },
            {
              type: "BigNumber",
              hex: "0x08b2215430cb",
            },
            {
              type: "BigNumber",
              hex: "-0x1ef3da705112586a73b31ddec47f67",
            },
          ],
          false,
        ],
        totalSupply: {
          type: "BigNumber",
          hex: "0x0bf35404623c4984a4aa7c",
        },
        indexTokenDecimals: 18,
        shortTokenDecimals: 6,
        longTokenDecimals: 18,
        marketTokens: {
          marketToken: "0xC25cEf6061Cf5dE5eb761b50E4743c1F5D7E5407",
          indexToken: "0x912CE59144191C1204E64559FE8253a0e49E6548",
          longToken: "0x912CE59144191C1204E64559FE8253a0e49E6548",
          shortToken: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
        },
        marketTokenPriceTradeMin: [
          {
            type: "BigNumber",
            hex: "0x10e7e5b5b2c74dcf8640b6d7f6",
          },
          [
            {
              type: "BigNumber",
              hex: "0x0e8edb907129b501e4ef659da4f8cd11",
            },
            {
              type: "BigNumber",
              hex: "0x047d2460ce94a817d53e912ded90e1",
            },
            {
              type: "BigNumber",
              hex: "-0x48e60ec4a2aa1fb95bd60214be3658",
            },
            {
              type: "BigNumber",
              hex: "-0x4468ea63d41577a1869770e6d0a577",
            },
            {
              type: "BigNumber",
              hex: "0x04747aed1ecf02bcd8cdd8",
            },
            {
              type: "BigNumber",
              hex: "0x08b2215430cb",
            },
            {
              type: "BigNumber",
              hex: "0x07310f203fb259af14f00209d6b4b600",
            },
            {
              type: "BigNumber",
              hex: "0x07318f9406b686a31cd270e062f60000",
            },
            {
              type: "BigNumber",
              hex: "0x0203ceebfbcc81465e9c2c561d11cb",
            },
            {
              type: "BigNumber",
              hex: "0x07f3a3c9314b1b95e2f0000000",
            },
            {
              type: "BigNumber",
              hex: "0x0fbf847e41564f6658fa",
            },
          ],
        ],
        marketTokenPriceTradeMax: [
          {
            type: "BigNumber",
            hex: "0x10eaddcb61cbf0886630c18098",
          },
          [
            {
              type: "BigNumber",
              hex: "0x0e916a1776ddd7d42ef9948ff163a711",
            },
            {
              type: "BigNumber",
              hex: "0x0405df0f9b6f1eb06ad273d1cbfef1",
            },
            {
              type: "BigNumber",
              hex: "-0x4964c97a137e6bfc43cddf05344648",
            },
            {
              type: "BigNumber",
              hex: "-0x455eea6a780f4d4bd8fb6b33684757",
            },
            {
              type: "BigNumber",
              hex: "0x04747aed1ecf02bcd8cdd8",
            },
            {
              type: "BigNumber",
              hex: "0x08b2215430cb",
            },
            {
              type: "BigNumber",
              hex: "0x073279379d6ab435d30e857a1ecd1780",
            },
            {
              type: "BigNumber",
              hex: "0x0731b903b06e0c05990b878710a80000",
            },
            {
              type: "BigNumber",
              hex: "0x0203ceebfbcc81465e9c2c561d11cb",
            },
            {
              type: "BigNumber",
              hex: "0x07f3a3c9314b1b95e2f0000000",
            },
            {
              type: "BigNumber",
              hex: "0x0fbf847e41564f6658fa",
            },
          ],
        ],
        marketTokenPriceDepositMin: [
          {
            type: "BigNumber",
            hex: "0x10e7e5b5b2c74dcf8640b6d7f6",
          },
          [
            {
              type: "BigNumber",
              hex: "0x0e8edb907129b501e4ef659da4f8cd11",
            },
            {
              type: "BigNumber",
              hex: "0x047d2460ce94a817d53e912ded90e1",
            },
            {
              type: "BigNumber",
              hex: "-0x48e60ec4a2aa1fb95bd60214be3658",
            },
            {
              type: "BigNumber",
              hex: "-0x4468ea63d41577a1869770e6d0a577",
            },
            {
              type: "BigNumber",
              hex: "0x04747aed1ecf02bcd8cdd8",
            },
            {
              type: "BigNumber",
              hex: "0x08b2215430cb",
            },
            {
              type: "BigNumber",
              hex: "0x07310f203fb259af14f00209d6b4b600",
            },
            {
              type: "BigNumber",
              hex: "0x07318f9406b686a31cd270e062f60000",
            },
            {
              type: "BigNumber",
              hex: "0x0203ceebfbcc81465e9c2c561d11cb",
            },
            {
              type: "BigNumber",
              hex: "0x07f3a3c9314b1b95e2f0000000",
            },
            {
              type: "BigNumber",
              hex: "0x0fbf847e41564f6658fa",
            },
          ],
        ],
        marketTokenPriceDepositMax: [
          {
            type: "BigNumber",
            hex: "0x10eaddcb61cbf0886630c18098",
          },
          [
            {
              type: "BigNumber",
              hex: "0x0e916a1776ddd7d42ef9948ff163a711",
            },
            {
              type: "BigNumber",
              hex: "0x0405df0f9b6f1eb06ad273d1cbfef1",
            },
            {
              type: "BigNumber",
              hex: "-0x4964c97a137e6bfc43cddf05344648",
            },
            {
              type: "BigNumber",
              hex: "-0x455eea6a780f4d4bd8fb6b33684757",
            },
            {
              type: "BigNumber",
              hex: "0x04747aed1ecf02bcd8cdd8",
            },
            {
              type: "BigNumber",
              hex: "0x08b2215430cb",
            },
            {
              type: "BigNumber",
              hex: "0x073279379d6ab435d30e857a1ecd1780",
            },
            {
              type: "BigNumber",
              hex: "0x0731b903b06e0c05990b878710a80000",
            },
            {
              type: "BigNumber",
              hex: "0x0203ceebfbcc81465e9c2c561d11cb",
            },
            {
              type: "BigNumber",
              hex: "0x07f3a3c9314b1b95e2f0000000",
            },
            {
              type: "BigNumber",
              hex: "0x0fbf847e41564f6658fa",
            },
          ],
        ],
        marketTokenPriceWithdrawMin: [
          {
            type: "BigNumber",
            hex: "0x10e7e5b5b2c74dcf8640b6d7f6",
          },
          [
            {
              type: "BigNumber",
              hex: "0x0e8edb907129b501e4ef659da4f8cd11",
            },
            {
              type: "BigNumber",
              hex: "0x047d2460ce94a817d53e912ded90e1",
            },
            {
              type: "BigNumber",
              hex: "-0x48e60ec4a2aa1fb95bd60214be3658",
            },
            {
              type: "BigNumber",
              hex: "-0x4468ea63d41577a1869770e6d0a577",
            },
            {
              type: "BigNumber",
              hex: "0x04747aed1ecf02bcd8cdd8",
            },
            {
              type: "BigNumber",
              hex: "0x08b2215430cb",
            },
            {
              type: "BigNumber",
              hex: "0x07310f203fb259af14f00209d6b4b600",
            },
            {
              type: "BigNumber",
              hex: "0x07318f9406b686a31cd270e062f60000",
            },
            {
              type: "BigNumber",
              hex: "0x0203ceebfbcc81465e9c2c561d11cb",
            },
            {
              type: "BigNumber",
              hex: "0x07f3a3c9314b1b95e2f0000000",
            },
            {
              type: "BigNumber",
              hex: "0x0fbf847e41564f6658fa",
            },
          ],
        ],
        marketTokenPriceWithdrawMax: [
          {
            type: "BigNumber",
            hex: "0x10eaddcb61cbf0886630c18098",
          },
          [
            {
              type: "BigNumber",
              hex: "0x0e916a1776ddd7d42ef9948ff163a711",
            },
            {
              type: "BigNumber",
              hex: "0x0405df0f9b6f1eb06ad273d1cbfef1",
            },
            {
              type: "BigNumber",
              hex: "-0x4964c97a137e6bfc43cddf05344648",
            },
            {
              type: "BigNumber",
              hex: "-0x455eea6a780f4d4bd8fb6b33684757",
            },
            {
              type: "BigNumber",
              hex: "0x04747aed1ecf02bcd8cdd8",
            },
            {
              type: "BigNumber",
              hex: "0x08b2215430cb",
            },
            {
              type: "BigNumber",
              hex: "0x073279379d6ab435d30e857a1ecd1780",
            },
            {
              type: "BigNumber",
              hex: "0x0731b903b06e0c05990b878710a80000",
            },
            {
              type: "BigNumber",
              hex: "0x0203ceebfbcc81465e9c2c561d11cb",
            },
            {
              type: "BigNumber",
              hex: "0x07f3a3c9314b1b95e2f0000000",
            },
            {
              type: "BigNumber",
              hex: "0x0fbf847e41564f6658fa",
            },
          ],
        ],
      },
      dataStoreInfo: {
        swapFeeFactorForNegativeImpact: {
          type: "BigNumber",
          hex: "0x024306c4097859c43c000000",
        },
        swapFeeFactorForPositiveImpact: {
          type: "BigNumber",
          hex: "0x019d971e4fe8401e74000000",
        },
        longPoolAmount: {
          type: "BigNumber",
          hex: "0x04747aed1ecf02bcd8cdd8",
        },
        shortPoolAmount: {
          type: "BigNumber",
          hex: "0x08b2215430cb",
        },
        longPoolAmountAdjustment: {
          type: "BigNumber",
          hex: "0x00",
        },
        shortPoolAmountAdjustment: {
          type: "BigNumber",
          hex: "0x00",
        },
        swapImpactFactorPositive: {
          type: "BigNumber",
          hex: "0xd8d726b7177a800000",
        },
        swapImpactFactorNegative: {
          type: "BigNumber",
          hex: "0x01b1ae4d6e2ef5000000",
        },
        swapImpactExponentFactor: {
          type: "BigNumber",
          hex: "0x193e5939a08ce9dbd480000000",
        },
        swapImpactPoolAmountLong: {
          type: "BigNumber",
          hex: "0x71ad0f14eabb5d3f",
        },
        swapImpactPoolAmountShort: {
          type: "BigNumber",
          hex: "0x6e2733",
        },
        longInterestInTokensUsingLongToken: {
          type: "BigNumber",
          hex: "0x2124a7a0abc4257cd7c0",
        },
        longInterestInTokensUsingShortToken: {
          type: "BigNumber",
          hex: "0x0156863e5c4b4429f23ab7",
        },
        shortInterestUsingLongToken: {
          type: "BigNumber",
          hex: "0xf859a199bd7ac5f1e969b4dc05ebf8",
        },
        shortInterestUsingShortToken: {
          type: "BigNumber",
          hex: "0x01431bcd3aa17439492344b078107b70",
        },
        reserveFactorLong: {
          type: "BigNumber",
          hex: "0x0bfd9d94f90fbbe204f0000000",
        },
        reserveFactorShort: {
          type: "BigNumber",
          hex: "0x0bfd9d94f90fbbe204f0000000",
        },
        maxLongPoolAmountForDeposit: {
          type: "BigNumber",
          hex: "0x066c15ed985d7873bc0000",
        },
        maxShortPoolAmountForDeposit: {
          type: "BigNumber",
          hex: "0x0b5e620f4800",
        },
        maxLongPoolAmount: {
          type: "BigNumber",
          hex: "0x0709eaf1d66f9b4b900000",
        },
        maxShortPoolAmount: {
          type: "BigNumber",
          hex: "0x0c75c7a22800",
        },
      },
      tokenPricesResponse: [
        {
          tokenAddress: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
          tokenSymbol: "ETH",
          minPrice: "2299451203280000",
          maxPrice: "2299979642720000",
          updatedAt: 1706880752897,
        },
        {
          tokenAddress: "0x47904963fc8b2340414262125aF798B9655E58Cd",
          tokenSymbol: "BTC",
          minPrice: "428306350000000000000000000",
          maxPrice: "428350057663700000000000000",
          updatedAt: 1706880752696,
        },
        {
          tokenAddress: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
          tokenSymbol: "WBTC.b",
          minPrice: "428306350000000000000000000",
          maxPrice: "428350057663700000000000000",
          updatedAt: 1706880752696,
        },
        {
          tokenAddress: "0xC4da4c24fd591125c3F47b340b6f4f76111883d8",
          tokenSymbol: "DOGE",
          minPrice: "788017300000000000000",
          maxPrice: "788474500000000000000",
          updatedAt: 1706880752696,
        },
        {
          tokenAddress: "0xB46A094Bc4B0adBD801E14b9DB95e05E28962764",
          tokenSymbol: "LTC",
          minPrice: "675538610300000000000000",
          maxPrice: "675857391400000000000000",
          updatedAt: 1706880752897,
        },
        {
          tokenAddress: "0x2bcC6D6CdBbDC0a4071e48bb3B969b06B3330c07",
          tokenSymbol: "SOL",
          minPrice: "100144133790000000000000",
          maxPrice: "100207860000000000000000",
          updatedAt: 1706880752897,
        },
        {
          tokenAddress: "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
          tokenSymbol: "UNI",
          minPrice: "6168839980000",
          maxPrice: "6175730310000",
          updatedAt: 1706880752696,
        },
        {
          tokenAddress: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
          tokenSymbol: "LINK",
          minPrice: "17715310990000",
          maxPrice: "17723513030000",
          updatedAt: 1706880752696,
        },
        {
          tokenAddress: "0x912CE59144191C1204E64559FE8253a0e49E6548",
          tokenSymbol: "ARB",
          minPrice: "1774924200000",
          maxPrice: "1776287810000",
          updatedAt: 1706880752295,
        },
        {
          tokenAddress: "0xc14e065b0067dE91534e032868f5Ac6ecf2c6868",
          tokenSymbol: "XRP",
          minPrice: "499410460000000000000000",
          maxPrice: "499692450000000000000000",
          updatedAt: 1706880752897,
        },
        {
          tokenAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
          tokenSymbol: "USDC",
          minPrice: "1000080980000000000000000",
          maxPrice: "1000168880000000000000000",
          updatedAt: 1706880752897,
        },
        {
          tokenAddress: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
          tokenSymbol: "USDC.e",
          minPrice: "1000080980000000000000000",
          maxPrice: "1000168880000000000000000",
          updatedAt: 1706880752897,
        },
        {
          tokenAddress: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
          tokenSymbol: "USDT",
          minPrice: "999560690000000000000000",
          maxPrice: "999571090000000000000000",
          updatedAt: 1706880752897,
        },
        {
          tokenAddress: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
          tokenSymbol: "DAI",
          minPrice: "999737190000",
          maxPrice: "999859760000",
          updatedAt: 1706880752897,
        },
        {
          tokenAddress: "0xa9004A5421372E1D83fB1f85b0fc986c912f91f3",
          tokenSymbol: "BNB",
          minPrice: "301065553930000",
          maxPrice: "301164603290000",
          updatedAt: 1706880752897,
        },
      ],
    },
    hasActiveGmOrder: false,
  },
};
