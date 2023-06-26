import {
  getPublicClient,
  getWalletClient,
  waitForTransaction,
} from "@wagmi/core";

export const cook = async (contract, cookData, value) => {
  const publicClient = getPublicClient();
  const walletClient = await getWalletClient();
  const account = walletClient.account.address;

  const { request } = await publicClient.simulateContract({
    address: contract.address,
    abi: contract.interface.fragments,
    functionName: "cook",
    args: [cookData.events, cookData.values, cookData.datas],
    chain: publicClient.chain,
    value,
    account,
  });

  const { hash } = await walletClient.writeContract(request);

  return await waitForTransaction({
    hash,
  });
};