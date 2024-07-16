import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import store from "@/store";
import { Contract } from "ethers";
import { createWalletClient, custom } from "viem";
import { getAccountHelper } from "@/helpers/walletClienHelper";
import { getChainConfig } from "@/helpers/chains/getChainsInfo";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { checkUseTenderlyFork } from "@/helpers/tenderly/checkUseTenderlyFork";

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
  const useForkRpc = checkUseTenderlyFork(cauldronObject.config.chainId);

  if (useForkRpc) return cookTenderly(cauldronObject, cookData, value);

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

const cookTenderly = async (cauldronObject, cookData, value) => {
  try {
    const account = getAccountHelper();
    const chainConfig = getChainConfig(cauldronObject.config.chainId);
    const publicClient = getPublicClient(cauldronObject.config.chainId);

    const walletClient = createWalletClient({
      chain: chainConfig.viemConfig,
      transport: custom(publicClient),
    });

    const { request } = await publicClient.simulateContract({
      account: account,
      address: cauldronObject.config.contract.address,
      abi: cauldronObject.config.contract.abi,
      functionName: "cook",
      args: [cookData.events, cookData.values, cookData.datas],
      value,
    });

    return await walletClient.writeContract(request);
  } catch (error) {
    console.log("error");

    const signer = store.getters.getSigner;

    const cauldronContract = new Contract(
      cauldronObject.config.contract.address,
      cauldronObject.config.contract.abi,
      signer
    );

    const tx = await cauldronContract.cook(
      cookData.events,
      cookData.values,
      cookData.datas,
      {
        value,
        gasLimit: 5000000,
      }
    );

    return await tx.wait();
  }
};
