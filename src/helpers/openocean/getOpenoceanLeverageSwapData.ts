import type { Address } from "viem";
import { Contract, providers, utils } from "ethers";
import { KAVA_USDT_ADDRESS } from "@/constants/tokensAddress";
import { fetchOpenocenSwapData } from "@/helpers/openocean/fetchOpenocenSwapData";

const abi = [
  "function calc_token_amount(uint256[2],bool) view returns (uint256)",
  "function calc_withdraw_one_coin(uint256,int128) view returns (uint256)",
  "function coins(uint256) external view returns (address)",
];

const calcTokenAmount = async (
  cauldronConfig: any,
  provider: any,
  amount: any
) => {
  const { unwrappedToken } = cauldronConfig.contracts;
  const lpContract = await new Contract(unwrappedToken.address, abi, provider);
  return await lpContract.calc_token_amount([amount, 0], true);
};

export const getOpenoceanLeverageSwapData = async (
  cauldronConfig: any,
  amount: string,
  slipage: number,
  userAddr: Address,
  provider: providers.BaseProvider
) => {
  const { isMimUsdtCurveLp } = cauldronConfig.config.cauldronSettings;
  const { mim } = cauldronConfig.contracts;

  const calcAmount = isMimUsdtCurveLp
    ? await calcTokenAmount(cauldronConfig, provider, amount)
    : amount;

  const swapData = await fetchOpenocenSwapData(
    mim.address,
    KAVA_USDT_ADDRESS,
    calcAmount,
    slipage,
    userAddr,
    2222
  );

  if (isMimUsdtCurveLp) {
    return utils.defaultAbiCoder.encode(
      ["address", "uint256", "bytes"],
      [KAVA_USDT_ADDRESS, "2", swapData]
    );
  }

  return swapData;
};
