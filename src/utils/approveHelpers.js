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
    const estimateGas = await tokenContract.estimateGas.approve(
      spenderAddress,
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
    );

    const gasLimit = 1000 + +estimateGas.toString();

    console.log("gasLimit:", gasLimit);

    const tx = await tokenContract.approve(
      spenderAddress,
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      {
        gasLimit,
      }
    );

    await tx.wait();

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
