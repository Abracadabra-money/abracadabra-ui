import { KAVA_USDT_ADDRESS } from "@/constants/tokensAddress";
import { BigNumber, Contract, providers, utils } from "ethers";
import { fetchOpenocenSwapData } from "@/helpers/openocean/fetchOpenocenSwapData";

const LPAbi = [
  "function calc_token_amount(uint256[2],bool) view returns (uint256)",
  "function calc_withdraw_one_coin(uint256,int128) view returns (uint256)",
  "function coins(uint256) external view returns (address)",
];

const calcWithdrawAmount = async (
  cauldronConfig: any,
  provider: providers.BaseProvider,
  amount: BigNumber
) => {
  const { unwrappedToken } = cauldronConfig.contracts;

  const lpContract = await new Contract(
    unwrappedToken.address,
    LPAbi,
    provider
  );

  return await lpContract.calc_withdraw_one_coin(amount, "1");
};

export const getOpenoceanDeleverageSwapData = async (
  cauldronConfig: any,
  amount: BigNumber,
  slipage: number,
  provider: providers.BaseProvider
) => {
  const { mim } = cauldronConfig.contracts;
  const { address } = cauldronConfig.config.deleverageInfo;
  const { isMimUsdtCurveLp } = cauldronConfig.config.cauldronSettings;

  const calcAmount = isMimUsdtCurveLp
    ? await calcWithdrawAmount(cauldronConfig, provider, amount)
    : amount;

  const swapData = await fetchOpenocenSwapData(
    KAVA_USDT_ADDRESS,
    mim.address,
    calcAmount,
    slipage,
    address,
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
