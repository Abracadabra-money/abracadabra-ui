import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";

export const cook = async (contract, cookData, value) => {
  const estimateGas = await contract.estimateGas.cook(
    cookData.events,
    cookData.values,
    cookData.datas,
    {
      value,
    }
  );

  const gasLimit = estimateGas.add(5000);

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

export const cookViem = async (cauldronObject, cookData, value) => {
  console.log("cauldronObject", cauldronObject)

  const { request } = await simulateContractHelper({
    address: cauldronObject.config.contract.address,
    abi: cauldronObject.config.contract.abi,
    functionName: "cook",
    args: [cookData.events, cookData.values, cookData.datas],
    value,
  });

  const hash = await writeContractHelper(request);

  return await waitForTransactionReceiptHelper({ hash });
};
