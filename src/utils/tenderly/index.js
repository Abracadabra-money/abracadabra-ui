import axios from "axios";
import { ethers, Contract } from "ethers";
import { approveToken } from "@/utils/approveHelpers.js";
import bentoBoxAbi from "@/utils/abi/bentoBox";

let signer;
let levSwapperContractContractOnForkedNet;
let tokenCollateralContractOnForkedNet;
let forkedNetBentoContract;
let provider;

const TENDERLY_ACCESS_KEY = process.env.VUE_APP_TENDERLY_ACCESS_KEY;
const TENDERLY_BASE_URL =
  "https://api.tenderly.co/api/v1/account/abracadabra/project/magic-internet-money";

export const createFork = async (chainId) => {
  const opts = {
    headers: {
      "X-Access-Key": TENDERLY_ACCESS_KEY,
    },
  };

  const body = {
    network_id: chainId,
  };

  try {
    const res = await axios.post(TENDERLY_BASE_URL + "/fork", body, opts);
    console.log("res", res);
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const deleteFork = async (forkId) => {
  const opts = {
    headers: {
      "X-Access-Key": TENDERLY_ACCESS_KEY,
    },
  };

  await fetch(`${TENDERLY_BASE_URL}/fork/${forkId}`, {
    method: "DELETE",
    headers: opts.headers,
    keepalive: true,
  });

  // await axios.delete(`${TENDERLY_BASE_URL}/fork/${forkId}`, opts);
};

export const getSimulationDetails = async (forkId, txnId) => {
  const opts = {
    headers: {
      "X-Access-Key": TENDERLY_ACCESS_KEY,
    },
  };

  try {
    const res = await axios.get(
      `${TENDERLY_BASE_URL}/fork/${forkId}/simulation/${txnId}`,
      opts
    );
    console.log("res", res);
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const fundGasToken = async (userAddr, provider) => {
  const params = [[userAddr], ethers.utils.hexValue(1000000000000000)];

  const res = await provider.send("tenderly_addBalance", params);
  return res;
};

export const fundCollateralToken = async (amount, userAddr, gasLimitConst) => {
  const tokenContract = tokenCollateralContractOnForkedNet;
  const FROM_ADDRESS = tokenContract.address;
  console.log("from addresss", FROM_ADDRESS);
  const tokenAmount = ethers.utils.hexValue(
    ethers.BigNumber.from(amount).toHexString(10)
  );

  const unsignedTx = await tokenContract.populateTransaction.approve(
    userAddr,
    tokenAmount
  );

  const estimateGasForCollateralSendApproval =
    await tokenContract.estimateGas.approve(userAddr, tokenAmount);
  const gasLimitForCollateralSendApproval =
    gasLimitConst + +estimateGasForCollateralSendApproval.toString();
  console.log("gas limit", gasLimitForCollateralSendApproval);

  const transactionParameters = [
    {
      to: tokenContract.address,
      from: FROM_ADDRESS,
      data: unsignedTx.data,
      gasLimit: ethers.utils.hexValue(gasLimitForCollateralSendApproval),
      value: ethers.utils.hexValue(0),
    },
  ];
  await provider.send("eth_sendTransaction", transactionParameters);
  console.log("approve spend for user address");

  const estimateGasForCollateralTransfer =
    await tokenContract.estimateGas.transferFrom(
      FROM_ADDRESS,
      userAddr,
      tokenAmount
    );
  const gasLimitForCollateralTransfer =
    gasLimitConst * 100 + +estimateGasForCollateralTransfer.toString();
  console.log(
    "gas limit for collateral transfer",
    gasLimitForCollateralTransfer
  );

  const respTxTransfer = await tokenContract.transferFrom(
    FROM_ADDRESS,
    userAddr,
    tokenAmount,
    {
      gasLimit: gasLimitForCollateralTransfer,
    }
  );
  console.log("collateral token sent");
  await respTxTransfer.wait();
};

const prepareFork = async (chainId) => {
  //1. CREATE FORK
  const forkRes = await createFork(chainId);
  const forkId = forkRes.data.simulation_fork.id;
  const forkRPC = `https://rpc.tenderly.co/fork/${forkId}`;

  provider = new ethers.providers.JsonRpcProvider(forkRPC);
  const userWallet = new ethers.Wallet(
    "0xd273a2a4f3377bcc0de92830b8aca056064d9b53257b26c492197c98169f1513",
    provider
  );
  signer = userWallet.connect(provider);
  const signerAddress = await signer.getAddress();

  //2. FUND GAS TOKEN
  await fundGasToken(signerAddress, provider);
  // console.log("successfully funded wallet with native token");

  return {
    forkId,
  };
};

//Instantiates collateral and swapper contract
//approves collateral token for transfer and swap
//fund the token contract with gas token to allow collateral token to be sent out to simulation wallet
async function prepareContractsAndApprove(pool) {
  tokenCollateralContractOnForkedNet = new Contract(
    pool.collateralToken.address,
    pool.collateralToken.abi,
    signer
  );
  console.log(
    "collateral token on forked net",
    tokenCollateralContractOnForkedNet
  );
  await approveToken(
    tokenCollateralContractOnForkedNet,
    pool.masterContractInstance.address
  );
  console.log("approved collateral token for spend by bento contract", pool);
  //5. SWAP APPROVAL
  levSwapperContractContractOnForkedNet = new Contract(
    pool.levSwapperContract.address,
    pool.levSwapper.abi,
    signer
  );
  await approveToken(
    tokenCollateralContractOnForkedNet,
    levSwapperContractContractOnForkedNet.address
  );
  console.log("approved swap contract spend");

  await fundGasToken(tokenCollateralContractOnForkedNet.address, provider);
  console.log("funded from addresss with native token");
}

async function approveMasterContract(pool) {
  const userAddr = await signer.getAddress();
  try {
    const masterContract = await pool.contractInstance.masterContract();

    const estimateGas =
      await pool.masterContractInstance.estimateGas.setMasterContractApproval(
        userAddr,
        masterContract,
        true,
        ethers.utils.formatBytes32String(""),
        ethers.utils.formatBytes32String(""),
        ethers.utils.formatBytes32String("")
      );

    const gasLimit = GAS_LIMIT_CONST + +estimateGas.toString();

    const tx = await pool.masterContractInstance.setMasterContractApproval(
      userAddr,
      masterContract,
      true,
      ethers.utils.formatBytes32String(""),
      ethers.utils.formatBytes32String(""),
      ethers.utils.formatBytes32String(""),
      { gasLimit }
    );

    const receipt = await tx.wait();
    return receipt;
  } catch (e) {
    console.log("approveMasterContract err:", e);
    return false;
  }
}

function parseSignature(signature) {
  const parsedSignature = signature.substring(2);

  var r = parsedSignature.substring(0, 64);
  var s = parsedSignature.substring(64, 128);
  var v = parsedSignature.substring(128, 130);

  return {
    r: "0x" + r,
    s: "0x" + s,
    v: parseInt(v, 16),
  };
}

async function getApprovalEncode(pool, chainId) {
  const account = await signer.getAddress();

  const verifyingContract = await pool.contractInstance.bentoBox();
  const masterContract = await pool.contractInstance.masterContract();
  const nonce = await forkedNetBentoContract.nonces(account);
  const chainIdHex = ethers.utils.hexlify(chainId);

  const domain = {
    name: "BentoBox V1",
    chainId: chainIdHex,
    verifyingContract,
  };

  // The named list of all type definitions
  const types = {
    SetMasterContractApproval: [
      { name: "warning", type: "string" },
      { name: "user", type: "address" },
      { name: "masterContract", type: "address" },
      { name: "approved", type: "bool" },
      { name: "nonce", type: "uint256" },
    ],
  };

  // The data to sign
  const value = {
    warning: "Give FULL access to funds in (and approved to) BentoBox?",
    user: account,
    masterContract,
    approved: true,
    nonce,
  };

  let signature;
  try {
    signature = await signer._signTypedData(domain, types, value);
  } catch (e) {
    console.log("SIG ERR:", e.code);

    if (e.code === -32603) {
      console.log("signature ERROR LEGER HERE", e.code);
      return "ledger";
    }
    return false;
  }

  const parsedSignature = parseSignature(signature);

  if (parsedSignature.v === 0) {
    parsedSignature.v = 27;
  }

  if (parsedSignature.v === 1) {
    parsedSignature.v = 28;
  }

  return ethers.utils.defaultAbiCoder.encode(
    ["address", "address", "bool", "uint8", "bytes32", "bytes32"],
    [
      account,
      masterContract,
      true,
      parsedSignature.v,
      parsedSignature.r,
      parsedSignature.s,
    ]
  );
}

function getUpdateRateEncode() {
  return ethers.utils.defaultAbiCoder.encode(
    ["bool", "uint256", "uint256"],
    [true, "0x00", "0x00"]
  );
}

// this.getWhitelistCallData(); find a way aroudn it
const GAS_LIMIT_CONST = 1000;
const DEFAULT_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

async function tenderlySimCookMultiBorrow(
  {
    collateralAmount,
    amount,
    updatePrice,
    minExpected,
    itsDefaultBalance,
    slipage,
  },
  pool,
  chainId,
  forkId
) {
  console.log("successfully funded wallet with collateral token");
  const signerAddress = await signer.getAddress();
  console.log("slipage", slipage);
  //3. FUND COLLATERAL TOKEN
  await fundCollateralToken(
    collateralAmount.toString(),
    signerAddress,
    GAS_LIMIT_CONST
  );
  const tokenAddr = itsDefaultBalance
    ? DEFAULT_TOKEN_ADDRESS
    : pool.collateralToken.address;
  console.log("tokenAddr", DEFAULT_TOKEN_ADDRESS);

  const collateralValue = itsDefaultBalance ? collateralAmount.toString() : 0;
  const swapperAddres = pool.levSwapperContract.address;
  const eventsArray = [];
  const valuesArray = [];
  const datasArray = [];
  forkedNetBentoContract = new Contract(
    pool.bentoBoxAddress,
    bentoBoxAbi,
    signer
  );
  const approvalEncode = await getApprovalEncode(pool, chainId);
  console.log("approval encode", approvalEncode);
  if (approvalEncode === "ledger") {
    const approvalMaster = await approveMasterContract(pool);
    if (!approvalMaster) return false;
  } else {
    eventsArray.push(24);
    valuesArray.push(0);
    datasArray.push(approvalEncode);
  }
  // console.log("need whitelister approve", this.needWhitelisterApprove);
  // if (this.needWhitelisterApprove) {
  //   const whitelistedCallData = await this.getWhitelistCallData();
  //   eventsArray.push(30);
  //   valuesArray.push(0);
  //   datasArray.push(whitelistedCallData);
  // }
  console.log("update price", updatePrice);
  if (updatePrice) {
    const updateEncode = getUpdateRateEncode();
    eventsArray.push(11);
    valuesArray.push(0);
    datasArray.push(updateEncode);
  }
  //10
  const getCollateralEncode2 = ethers.utils.defaultAbiCoder.encode(
    ["int256", "address", "bool"],
    ["-0x02", signerAddress, false]
  );
  console.log("collateral amount", collateralAmount.toString());
  if (collateralAmount) {
    //20
    const getDepositEncode1 = ethers.utils.defaultAbiCoder.encode(
      ["address", "address", "int256", "int256"],
      [tokenAddr, signerAddress, collateralAmount, "0"]
    );
    //DEPOSIT COLLATERAL
    eventsArray.push(20);
    valuesArray.push(collateralValue);
    datasArray.push(getDepositEncode1);
    //ADD COLLATERAL
    eventsArray.push(10);
    valuesArray.push(0);
    datasArray.push(getCollateralEncode2);
  }
  //5
  const getBorrowSwapperEncode2 = ethers.utils.defaultAbiCoder.encode(
    ["int256", "address"],
    [amount, swapperAddres]
  );
  console.log("get borrow swapper"), getBorrowSwapperEncode2;
  eventsArray.push(5);
  valuesArray.push(0);
  datasArray.push(getBorrowSwapperEncode2);
  let swapStaticTx, swapCallByte, getCallEncode2;
  if (pool.is0xSwap) {
    console.log("0x swap pool", pool.is0xSwap);
    // const response = await this.query0x(
    //   pool.collateralToken.address,
    //   pool.borrowToken.address,
    //   slipage,
    //   amount,
    //   pool.levSwapperContract.address
    // );
    // console.log("queried 0x", response);
    // const swapData = response.data;
    // swapStaticTx = await pool.levSwapperContract.populateTransaction.swap(
    //   userAddr,
    //   minExpected,
    //   amount,
    //   swapData,
    //   {
    //     gasLimit: 10000000,
    //   }
    // );
    // console.log("swap response", swapStaticTx);
    // swapCallByte = swapStaticTx.data;
    // //30
    // getCallEncode2 = ethers.utils.defaultAbiCoder.encode(
    //   ["address", "bytes", "bool", "bool", "uint8"],
    //   [swapperAddres, swapCallByte, false, false, 2]
    // );
  } else {
    swapStaticTx =
      await levSwapperContractContractOnForkedNet.populateTransaction.swap(
        signerAddress,
        minExpected,
        0,
        {
          gasLimit: 10000000,
        }
      );
    console.log("normal pool swap response", swapStaticTx);
    swapCallByte = swapStaticTx.data.substr(0, 138);
    //30
    getCallEncode2 = ethers.utils.defaultAbiCoder.encode(
      ["address", "bytes", "bool", "bool", "uint8"],
      [swapperAddres, swapCallByte, false, true, 2]
    );
  }
  eventsArray.push(30);
  valuesArray.push(0);
  datasArray.push(getCallEncode2);
  eventsArray.push(10);
  valuesArray.push(0);
  datasArray.push(getCollateralEncode2);
  const cookData = {
    events: eventsArray,
    values: valuesArray,
    datas: datasArray,
  };
  try {
    const cauldronContractOnForkedNet = new Contract(
      pool.contractInstance.address,
      pool.cauldronContractAbi,
      signer
    );

    // const estimateGasForCookTx =
    //   await cauldronContractOnForkedNet.estimateGas.cook(
    //     cookData.events,
    //     cookData.values,
    //     cookData.datas,
    //     {
    //       value: collateralValue,
    //     }
    //   );
    // const gasLimitForCookTx =
    //   GAS_LIMIT_CONST + +estimateGasForCookTx.toString();

    const unsignedCookTx =
      await cauldronContractOnForkedNet.populateTransaction.cook(
        cookData.events,
        cookData.values,
        cookData.datas,
        {
          gasLimit: 1000000,
          value: collateralValue,
        }
      );
    const transactionParametersForForkedCook = [
      {
        to: cauldronContractOnForkedNet.address,
        from: signerAddress,
        data: unsignedCookTx.data,
        gas: ethers.utils.hexValue(1000000),
        gasPrice: ethers.utils.hexValue(1),
      },
    ];
    await provider.send(
      "eth_sendTransaction",
      transactionParametersForForkedCook
    );

    const lastTxnId = await provider.send("evm_snapshot", []);
    const lastTxn = await getSimulationDetails(forkId, lastTxnId);
    const txnStatus = lastTxn.data.simulation.status;
    if (!txnStatus) {
      return {
        lastTxnId,
      };
    }

    const userBorrowPart =
      lastTxn.data.transaction.transaction_info.logs[7].inputs[2].value;
    const userCollateralDeposited =
      lastTxn.data.transaction.transaction_info.logs[4].inputs[2].value;
    const userCollateralBorrwed =
      lastTxn.data.transaction.transaction_info.logs[24].inputs[2].value;
    const userCollateralShare = ethers.BigNumber.from(
      userCollateralBorrwed
    ).add(userCollateralDeposited);

    return {
      userCollateralShare: userCollateralShare.toString(),
      userBorrowPart,
      lastTxnId,
    };
  } catch (e) {
    console.log("SimulateCookMultiBorrow ERR:", e);
    return;
  }
}

export { prepareFork, tenderlySimCookMultiBorrow, prepareContractsAndApprove };
