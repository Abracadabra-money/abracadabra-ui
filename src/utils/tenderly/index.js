import axios from "axios";
import { ethers } from "ethers";

const TENDERLY_ACCESS_KEY = "-fdZauEZo0OUpEeQFMpYmsztBN5dVqWz";
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

  await axios.delete(`${TENDERLY_BASE_URL}/fork/${forkId}`, opts);
};

export const fundGasToken = async (userAddr, provider) => {
  const params = [[userAddr], ethers.utils.hexValue(1000000000000000)];

  const res = await provider.send("tenderly_addBalance", params);
  return res;
};

export const fundCollateralToken = async (
  tokenContract,
  amount,
  userAddr,
  provider,
  gasLimitConst
) => {
  const FROM_ADDRESS = tokenContract.address;
  console.log("from addresss", FROM_ADDRESS);
  const tokenAmount = ethers.utils.hexValue(
    ethers.BigNumber.from(amount).toHexString(10)
  );

  await fundGasToken(FROM_ADDRESS, provider);
  console.log("funded from addresss with native token");

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
