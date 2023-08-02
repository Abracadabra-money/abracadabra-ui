import { ethers } from "ethers";
import { getTokenPriceByAddress } from "@/helpers/priceHelper.js";
import { getYieldAndLpPrice } from "@/helpers/farm/getYieldAndLpPrice";
import { getRoi } from "@/helpers/farm/getRoi";
import { getTVL } from "@/helpers/farm/getTVL";
import { getFarmUserInfo } from "@/helpers/farm/getFarmUserInfo";
import farmsConfig from "@/utils/farmsConfig/farms";

const tokenAddresses = {
  SPELL: "0x090185f2135308bad17527004364ebcc2d37e5f6",
  MIM: "0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3",
  WETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
};

export const createFarmItemConfig = async (
  farmId: string | number,
  chainId: number,
  signer: any,
  account: string
) => {
  const farmsOnChain = farmsConfig.filter(
    (farm) => farm.contractChain === chainId
  );
  const farmPoolInfo = farmsOnChain.find(({ id }) => +id === +farmId);

  const contractInstance = new ethers.Contract(
    farmPoolInfo.contract.address,
    JSON.stringify(farmPoolInfo.contract.abi),
    signer
  );

  const poolInfo = await contractInstance.poolInfo(farmPoolInfo.poolId);

  const stakingTokenContract = new ethers.Contract(
    poolInfo.stakingToken,
    JSON.stringify(farmPoolInfo.stakingTokenAbi),
    signer
  );

  const tokenPrice = await getTokenPriceByAddress(
    //todo
    //create a type for token adresses
    tokenAddresses["SELL" as keyof typeof tokenAddresses]
  );

  const { poolYield, lpPrice } = await getYieldAndLpPrice(
    stakingTokenContract,
    contractInstance,
    poolInfo,
    farmPoolInfo,
    signer
  );

  const poolRoi = await getRoi(poolYield, tokenPrice);

  const poolTvl = await getTVL(poolInfo.stakingTokenTotalAmount, lpPrice);

  const isDepreciated = poolRoi === 0;

  let accountInfo: any = null;

  //todo
  const farmItemConfig = {
    name: farmPoolInfo.name,
    icon: farmPoolInfo.icon,
    //check actuality
    // nameSubtitle: farmPoolInfo.nameSubtitle,
    stakingTokenLink: farmPoolInfo.stakingTokenLink,
    //check actuality
    // stakingTokenIcon: farmPoolInfo.stakingTokenIcon,
    //check actuality
    id: farmPoolInfo.id,
    poolId: farmPoolInfo.poolId,
    contractInstance,
    stakingTokenName: farmPoolInfo.stakingTokenName,
    //check actuality
    // stakingTokenType: farmPoolInfo.stakingTokenType,
    //check actuality
    // lpPrice,
    //check actuality
    // depositedBalance: farmPoolInfo.depositedBalance,
    contractAddress: farmPoolInfo.contract.address,
    //under ?
    // poolInfo,
    stakingTokenContract,
    //check actuality
    // tokenPrice,
    //check actuality (actual)
    poolYield,
    poolRoi,
    poolTvl,
    //check actuality
    // tokenName: farmPoolInfo.earnedToken.name,
    accountInfo,
    isDepreciated,
  };

  if (account) {
    farmItemConfig.accountInfo = await getFarmUserInfo(farmItemConfig);
  }

  return farmItemConfig;
};
