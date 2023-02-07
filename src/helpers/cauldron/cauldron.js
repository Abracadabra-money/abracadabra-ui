export const cook = async (contract, cookData, value) => {
  try {
    const estimateGas = await contract.estimateGas.cook(
      cookData.events,
      cookData.values,
      cookData.datas,
      {
        value,
      }
    );

    const gasLimit = estimateGas.add(1000);

    const tx = await pool.contractInstance.cook(
      cookData.events,
      cookData.values,
      cookData.datas,
      {
        value,
        gasLimit,
      }
    );

    return await tx.wait();
  } catch (error) {
    console.log("cook error:", error);
    return error;
  }
};