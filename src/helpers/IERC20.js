const maxAmount =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

export const approve = async (contract, spender, amount = maxAmount) => {
  try {
    const estimateGas = await await contract.estimateGas.approve(
      spender,
      amount
    );

    const gasLimit = estimateGas.add(1000);

    const tx = await contract.approve(spender, amount, { gasLimit });

    return await tx.wait();
  } catch (error) {
    console.log("approve err: ", error);
    return error;
  }
};