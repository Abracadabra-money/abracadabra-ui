import {
  getPublicClient,
  getWalletClient,
  waitForTransaction,
} from "@wagmi/core";

export const isTokenApprowed = async (
  tokenContract,
  spenderAddress,
  account,
  parsed = false
) => {
  try {
    const addressApprowed = await tokenContract.allowance(
      account,
      spenderAddress
    );

    if (parsed) return parseFloat(addressApprowed.toString()) > 0;
    return addressApprowed;
  } catch (e) {
    console.log("isApprowed err:", e);
    return false;
  }
};

export const approveToken = async (tokenContract, spenderAddress) => {
  try {
    const publicClient = getPublicClient();
    const walletClient = await getWalletClient();
    const account = walletClient.account.address;
    const MAX_AMOUNT = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

    const { request } = await publicClient.simulateContract({
      address: tokenContract.address,
      abi: tokenContract.interface.fragments,
      functionName: "approve",
      args: [spenderAddress, MAX_AMOUNT],
      chain: publicClient.chain,
      account,
    });

    const { hash } = await walletClient.writeContract(request);

    await waitForTransaction({
      hash,
    });

    return true;
  } catch (e) {
    console.log("isApprowed err:", e);
    return false;
  }
};

const getMasterContract = async (pool) => {
  try {
    const masterContract = await pool.contractInstance.masterContract();
    return masterContract;
  } catch (e) {
    console.log("getMasterContract err:", e);
  }
};

export const isApprowed = async (pool, account) => {
  try {
    const masterContract = await getMasterContract(pool);
    const addressApprowed =
      await pool.masterContractInstance.masterContractApproved(
        masterContract,
        account
      );
    return addressApprowed;
  } catch (e) {
    console.log("isApprowed err:", e);
  }
};
