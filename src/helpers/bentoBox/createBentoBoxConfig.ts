import mimTokenInfo from "@/utils/contracts/mimToken";
import bentoContractsInfo from "@/utils/contracts/master";
import degenBoxInfo from "@/utils/contracts/degenBox";
import { getTokenPriceByAddress } from "@/helpers/priceHelper";
import { multicall, readContract } from "@wagmi/core";
import type { Address } from "viem";

type MimInfo = {
  name: string;
  chainId: number;
  decimals: number;
  address: Address;
  abi: any;
};

export const createBentoBoxConfig = async (
  chainId: number,
  account: Address
) => {
  const mimInfo = mimTokenInfo.find(
    (token: MimInfo) => token.name === "MIM" && token.chainId === chainId
  );

  if (!mimInfo) {
    return false;
  }
  //todo global types
  const bentoContractInfo = bentoContractsInfo.find(
    (contractInfo: any) => contractInfo.chainId === chainId
  );

  const degenContractInfo = degenBoxInfo.find(
    (contractInfo: any) => contractInfo.chainId === chainId
  );

  const mimPrice = await getTokenPriceByAddress(
    1,
    "0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3"
  );

  const [
    bentoBalance,
    degenBalance,
    bentoAllowance,
    degenAllowance,
    mimBalance,
  ]: any = await multicall({
    contracts: [
      {
        address: bentoContractInfo.address,
        abi: bentoContractInfo.abi,
        functionName: "balanceOf",
        args: [mimInfo.address, account],
      },
      {
        address: degenContractInfo.address,
        abi: degenContractInfo.abi,
        functionName: "balanceOf",
        args: [mimInfo.address, account],
      },
      {
        address: mimInfo.address,
        abi: mimInfo.abi,
        functionName: "allowance",
        args: [account, bentoContractInfo.address],
      },
      {
        address: mimInfo.address,
        abi: mimInfo.abi,
        functionName: "allowance",
        args: [account, degenContractInfo.address],
      },
      {
        address: mimInfo.address,
        abi: mimInfo.abi,
        functionName: "balanceOf",
        args: [account],
      },
    ],
  });

  let mimInBentoBalance, mimInDegenBalance;

  if (bentoContractInfo)
    mimInBentoBalance = await readContract({
      address: bentoContractInfo.address,
      abi: bentoContractInfo.abi,
      functionName: "toAmount",
      args: [mimInfo.address, bentoBalance.result, false],
    });

  if (degenContractInfo)
    mimInDegenBalance = await readContract({
      address: degenContractInfo.address,
      abi: degenContractInfo.abi,
      functionName: "toAmount",
      args: [mimInfo.address, degenBalance.result, false],
    });

  return {
    mimBalance: mimBalance.result,
    mimPrice,
    mimInBentoBalance,
    mimInDegenBalance,
    bentoContractInfo,
    degenContractInfo,
    tokenInfo: mimInfo,
    bentoAllowance: bentoAllowance.result,
    degenAllowance: degenAllowance.result,
  };
};
