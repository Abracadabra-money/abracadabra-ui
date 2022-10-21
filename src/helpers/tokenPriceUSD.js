import { ethers } from "ethers";

const oracle = {
  address: "0x52B2773FB2f69d565C651d364f0AA95eBED097E4",
  data: "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000000",
  abi: [
    { inputs: [], stateMutability: "nonpayable", type: "constructor" },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "contract IOracle",
          name: "oldOracle",
          type: "address",
        },
        {
          indexed: true,
          internalType: "contract IOracle",
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
          indexed: true,
          internalType: "address",
          name: "previousOwner",
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
      inputs: [
        {
          internalType: "contract IOracle",
          name: "newOracle",
          type: "address",
        },
      ],
      name: "changeOracleImplementation",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "claimOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
      name: "get",
      outputs: [
        { internalType: "bool", name: "", type: "bool" },
        { internalType: "uint256", name: "", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "bytes", name: "", type: "bytes" }],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "oracleImplementation",
      outputs: [
        { internalType: "contract IOracle", name: "", type: "address" },
      ],
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
      inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
      name: "peek",
      outputs: [
        { internalType: "bool", name: "", type: "bool" },
        { internalType: "uint256", name: "", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
      name: "peekSpot",
      outputs: [{ internalType: "uint256", name: "rate", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "pendingOwner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "bytes", name: "", type: "bytes" }],
      name: "symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "newOwner", type: "address" },
        { internalType: "bool", name: "direct", type: "bool" },
        { internalType: "bool", name: "renounce", type: "bool" },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};

// 1 / rate

const getOracleExchangeRateByData = async (oracleContract, data) => {
  try {
    const rate = await oracleContract.peekSpot(data, {
      gasLimit: 300000,
    });

    return rate;
  } catch (e) {
    console.log("getOracleExchangeRate err:", e);
  }
};

const getContractExchangeRate = async (contract) => {
  try {
    const rate = await contract.exchangeRate({
      gasLimit: 300000,
    });

    return rate;
  } catch (e) {
    console.log("getContractExchangeRate err:", e);
  }
};

const tokenPriceUSD = async (signer, pool) => {
  console.log("POOL", pool);
  //   contractInstance

  const oracleContract = new ethers.Contract(
    oracle.address,
    JSON.stringify(oracle.abi),
    signer
  );

  const oracleExchangeRate = await getOracleExchangeRateByData(
    oracleContract,
    oracle.data
  );

  const contractExchangeRate = await getContractExchangeRate(
    pool.poolContractInstance
  );

  console.log("3333333", oracleExchangeRate);
  console.log("44444444", contractExchangeRate);

  let tokenPairRate;

  if (!contractExchangeRate) tokenPairRate = oracleExchangeRate;
  else if (
    oracleExchangeRate.toString() > contractExchangeRate.toString() &&
    !contractExchangeRate.eq(0)
  )
    tokenPairRate = contractExchangeRate;
  else tokenPairRate = oracleExchangeRate;

  const tokenPrice = Number(ethers.utils.formatUnits(tokenPairRate, 18));

  console.log("RATE ", tokenPrice);
};

export { tokenPriceUSD };

// const tokenPrice = Number(
//     this.$ethers.utils.formatUnits(tokenPairRate, pool.token.oracleDecimals || pool.token.decimals)
//   );
