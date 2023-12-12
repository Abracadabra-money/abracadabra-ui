//for deletion
export const deposit = async (contract, token, from, to, amount, share) => {
  try {
    const estimateGas = await contract.estimateGas.deposit(
      token,
      from,
      to,
      amount,
      share
    );

    const gasLimit = estimateGas.add(1000);

    const tx = await contract.deposit(token, from, to, amount, share, {
      gasLimit,
    });

    return await tx.wait();
  } catch (error) {
    console.log("box deposit error:", error);
    return error;
  }
};
//for deletion
export const withdraw = async (contract, token, from, to, amount, share) => {
  try {
    const estimateGas = await contract.estimateGas.withdraw(
      token,
      from,
      to,
      amount,
      share
    );

    const gasLimit = estimateGas.add(1000);

    const tx = await contract.withdraw(token, from, to, amount, share, {
      gasLimit,
    });

    return await tx.wait();
  } catch (error) {
    console.log("box withdraw error:", error);
    return error;
  }
};

export const setMasterContractApproval = async (
  contract,
  user,
  masterContract,
  approved,
  v = "0",
  r = "0x0000000000000000000000000000000000000000000000000000000000000000",
  s = "0x0000000000000000000000000000000000000000000000000000000000000000"
) => {
  try {
    const estimateGas = await contract.estimateGas.setMasterContractApproval(
      user,
      masterContract,
      approved,
      v,
      r,
      s
    );

    const gasLimit = estimateGas.add(1000);

    const tx = await contract.setMasterContractApproval(
      user,
      masterContract,
      approved,
      v,
      r,
      s,
      {
        gasLimit,
      }
    );

    return await tx.wait();
  } catch (error) {
    console.log("box setMasterContractApproval error:", error);
    return error;
  }
};
