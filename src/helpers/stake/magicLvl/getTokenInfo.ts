import { markRaw } from "vue";
import { BigNumber, utils } from "ethers";
import { BIPS, ONE_ETHER } from "@/constants/global";

const one = BigNumber.from(10).pow(18);
const precision = BigNumber.from(Math.pow(10, 18).toString());

export const getTokenInfo = async (
  contracts: any,
  harvestorContract: any,
  levelMasterContract: any,
  config: any,
  account: string,
  signer: any
) => {
  const tokenConfig = config[contracts.name];

  const [
    oracleRate,
    tokenRate,
    totalSupply,
    mainTokenBalance,
    userStakeTokenBalance,
    levelMasterBalance,
    allowanceAmount,
    feeBips,
  ]: any = await Promise.all([
    contracts.oracle.peekSpot("0x"),
    contracts.mainToken.convertToAssets(ONE_ETHER),
    contracts.mainToken.totalSupply(),
    contracts.mainToken.balanceOf(account),
    contracts.stakeToken.balanceOf(account),
    levelMasterContract.userInfo(tokenConfig.pid, account),
    contracts.stakeToken.allowance(account, contracts.mainToken.address),
    harvestorContract.feeBips(),
  ]);

  const stakeTokenPrice = one.mul(precision).div(oracleRate);
  const mainTokenPrice = stakeTokenPrice.mul(tokenRate).div(precision);

  const totalSupplyUsd = totalSupply.mul(mainTokenPrice).div(precision);
  const stakeTokenBalance = userStakeTokenBalance.add(
    levelMasterBalance?.amount
  );

  return {
    name: tokenConfig.name,
    tokensRate: +utils.formatUnits(tokenRate),
    feePercent: feeBips / BIPS,
    levelMasterContract: markRaw(levelMasterContract.connect(signer)),
    mainToken: {
      name: tokenConfig.mainToken.name,
      icon: tokenConfig.mainToken.icon,
      contract: markRaw(contracts.mainToken.connect(signer)),
      balance: utils.formatUnits(mainTokenBalance),
      totalSupplyUsd: +utils.formatUnits(totalSupplyUsd),
    },
    stakeToken: {
      name: tokenConfig.stakeToken.name,
      icon: tokenConfig.stakeToken.icon,
      contract: markRaw(contracts.stakeToken.connect(signer)),
      walletBalance: userStakeTokenBalance,
      balance: utils.formatUnits(stakeTokenBalance),
      approvedAmount: allowanceAmount,
      pid: tokenConfig.pid,
    },
  };
};
