import { markRaw } from "vue";
import { utils } from "ethers";
import { ONE_ETHER } from "@/constants/global";

export const getTokensInfo = async (
  contracts: any,
  signer: any,
  account: any,
  config: any
) => {
  const { magicApeContract, apeContract, oracleContract } = contracts;

  const [
    peekSpot,
    userApeBalance,
    userMagicApeBalance,
    allowanceAmount,
    totalSupply,
    apeToMagicApeRate,
  ] = await Promise.all([
    oracleContract.peekSpot("0x"),
    apeContract.balanceOf(account),
    magicApeContract.balanceOf(account),
    apeContract.allowance(account, magicApeContract.address),
    magicApeContract.totalSupply(),
    magicApeContract.convertToAssets(ONE_ETHER),
  ]);

  const apePrice = 1 / +utils.formatUnits(peekSpot);
  const tokensRate = +utils.formatUnits(apeToMagicApeRate);
  const magicApePrice = apePrice * tokensRate;

  const formatUserApeBalance = utils.formatUnits(userApeBalance);
  const userApeBalanceUsd = +formatUserApeBalance * apePrice;

  const formatUserMagicApeBalance = utils.formatUnits(userMagicApeBalance);
  const userMagicApeBalanceUsd = +formatUserMagicApeBalance * magicApePrice;

  const formatTotalSupply = utils.formatUnits(totalSupply);
  const totalSupplyUsd = +formatTotalSupply * magicApePrice;

  return {
    mainToken: {
      icon: config.mainToken.icon,
      name: config.mainToken.name,
      rateIcon: config.mainToken.rateIcon,
      contract: markRaw(magicApeContract.connect(signer)),
      price: magicApePrice,
      balance: formatUserMagicApeBalance,
      balanceUsd: userMagicApeBalanceUsd,
      totalSupply: formatTotalSupply,
      totalSupplyUsd,
      rate: tokensRate,
    },
    stakeToken: {
      icon: config.stakeToken.icon,
      name: config.stakeToken.name,
      contract: markRaw(apeContract.connect(signer)),
      price: apePrice,
      balance: formatUserApeBalance,
      approvedAmount: utils.formatUnits(allowanceAmount),
      balanceUsd: userApeBalanceUsd,
    },
  };
};
