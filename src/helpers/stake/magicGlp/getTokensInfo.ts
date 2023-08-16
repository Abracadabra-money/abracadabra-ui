import { markRaw } from "vue";
import { utils, BigNumber } from "ethers";

const precision = BigNumber.from(Math.pow(10, 18).toString());

export const getTokensInfo = async (
  contracts: any,
  address: any,
  config: any,
  signer: any
) => {
  const { decimals } = config.mainToken;
  const { magicGlpContract, glpContract, oracleContract } = contracts;

  const multicallArr = [
    magicGlpContract.balanceOf(address),
    magicGlpContract.totalSupply(),
    glpContract.balanceOf(address),
    glpContract.allowance(address, magicGlpContract.address),
    oracleContract.peekSpot("0x"),
    glpContract.balanceOf(magicGlpContract.address),
  ];

  const [
    userMagicGlpBalance,
    totalSupply,
    userGlpBalance,
    allowanceAmount,
    oracleExchangeRate,
    magicGlpAmount,
  ] = await Promise.all(multicallArr);

  const mainTokenPrice = utils
    .parseUnits("1", decimals)
    .mul(precision)
    .div(oracleExchangeRate);

  const tokenRate = magicGlpAmount.mul(precision).div(totalSupply);
  const stakeTokenPrice = mainTokenPrice.mul(precision).div(tokenRate);
  const formatMainTokenPrice = +utils.formatUnits(mainTokenPrice);
  const formatTotalSupply = utils.formatUnits(totalSupply);
  const totalSupplyUsd = +formatTotalSupply * formatMainTokenPrice;
  const mainTokenBalance = utils.formatUnits(userMagicGlpBalance);
  const mainTokenBalanceUsd = +mainTokenBalance * formatMainTokenPrice;
  const formatStakeTokenBalance = utils.formatUnits(userGlpBalance);
  const formastakeTokenPrice = +utils.formatUnits(stakeTokenPrice);
  const stakeTokenBalanceUsd = +formatStakeTokenBalance * formastakeTokenPrice;

  return {
    mainToken: {
      name: config.mainToken.name,
      icon: config.mainToken.icon,
      rateIcon: config.mainToken.rateIcon,
      decimals: config.mainToken.decimals,
      price: formatMainTokenPrice,
      rate: +utils.formatUnits(tokenRate),
      totalSupply: utils.formatUnits(totalSupply),
      totalSupplyUsd,
      balance: mainTokenBalance,
      balanceUsd: mainTokenBalanceUsd,
      approvedAmount: utils.formatUnits(allowanceAmount),
      contract: markRaw(magicGlpContract.connect(signer)),
    },
    stakeToken: {
      name: config.stakeToken.name,
      icon: config.stakeToken.icon,
      decimals: config.mainToken.decimals,
      price: +utils.formatUnits(stakeTokenPrice),
      balance: formatStakeTokenBalance,
      balanceUsd: stakeTokenBalanceUsd,
      contract: markRaw(glpContract.connect(signer)),
    },
  };
};
