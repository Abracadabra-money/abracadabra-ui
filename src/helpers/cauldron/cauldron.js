export const cook = async (contract, cookData, value) => {
  const estimateGas = await contract.estimateGas.cook(
    cookData.events,
    cookData.values,
    cookData.datas,
    {
      value,
    }
  );

  const gasLimit = estimateGas.add(1000);

  const tx = await contract.cook(
    cookData.events,
    cookData.values,
    cookData.datas,
    {
      value,
      gasLimit,
    }
  );

  return await tx.wait();
};
