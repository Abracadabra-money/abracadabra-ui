import { utils } from "ethers";
// import { Contract, providers, utils } from "ethers";
import { KAVA_USDT_ADDRESS } from "@/constants/tokensAddress";
import { fetchOpenocenSwapData } from "@/helpers/openocean/fetchOpenocenSwapData";

// const abi = [
//   "function calc_token_amount(uint256[2],bool) view returns (uint256)",
//   "function calc_withdraw_one_coin(uint256,int128) view returns (uint256)",
//   "function coins(uint256) external view returns (address)",
// ];

// const calcTokenAmount = async (
//   cauldronConfig: any,
//   provider: providers.BaseProvider,
//   amount: string
// ) => {
//   const { unwrappedToken } = cauldronConfig.contracts;
//   const lpContract = await new Contract(unwrappedToken.address, abi, provider);
//   return await lpContract.calc_token_amount([amount, 0], true);
// };

export const getOpenoceanLeverageSwapData = async (
  cauldronConfig: any,
  amount: string,
  slipage: number
  // provider: providers.BaseProvider
) => {
  const { isMimUsdtCurveLp } = cauldronConfig.config.cauldronSettings;
  const { address } = cauldronConfig.config.leverageInfo;
  const { mim } = cauldronConfig.contracts;

  // const calcAmount = isMimUsdtCurveLp
  //   ? await calcTokenAmount(cauldronConfig, provider, amount)
  //   : amount;

  // console.log("calcAmount", utils.formatUnits(calcAmount));

  const swapData = await fetchOpenocenSwapData(
    mim.address,
    KAVA_USDT_ADDRESS,
    amount,
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
