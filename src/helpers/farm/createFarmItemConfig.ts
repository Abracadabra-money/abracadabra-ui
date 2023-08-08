import { markRaw } from "vue";
import { ethers } from "ethers";
import { getTokensArrayPrices } from "@/helpers/priceHelper.js";
import { getFarmYieldAndLpPrice } from "@/helpers/farm/getFarmYieldAndLpPrice";
import { getRoi } from "@/helpers/farm/getRoi";
import { getTVL } from "@/helpers/farm/getTVL";
import { getFarmUserInfo } from "@/helpers/farm/getFarmUserInfo";
import farmsConfig from "@/utils/farmsConfig/farms";

import type { FarmConfig } from "@/utils/farmsConfig/types";

const tokenAddresses = {
  SPELL: "0x090185f2135308bad17527004364ebcc2d37e5f6",
  MIM: "0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3",
  WETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
};

export const createFarmItemConfig = async (
  farmId: string | number,
  chainId: number,
  signer: any,
  account: any,
  isExtended = true
) => {
  const farmsOnChain = farmsConfig.filter(
    (farm) => farm.contractChain === chainId
  );

  const farmInfo: FarmConfig | undefined = farmsOnChain.find(
    ({ id }) => +id === +farmId
  );

  if (!farmInfo) return false;

  const { SPELLPrice, MIMPrice, WETHPrice } = await getTokensPrices();

  if (!signer) signer = getDefaultSigner(chainId);

  const contractInstance = new ethers.Contract(
    farmInfo.contract.address,
    JSON.stringify(farmInfo.contract.abi),
    signer
  );

  const poolInfo = await contractInstance.poolInfo(farmInfo.farmId);

  const stakingTokenContract = new ethers.Contract(
    poolInfo.stakingToken,
    JSON.stringify(farmInfo.stakingTokenAbi),
    signer
  );

  const { farmYield, lpPrice } = await getFarmYieldAndLpPrice(
    stakingTokenContract,
    contractInstance,
    poolInfo,
    farmInfo,
    signer,
    MIMPrice,
    SPELLPrice
  );

  const farmRoi = +farmYield
    ? await getRoi(+farmYield, SPELLPrice)
    : +farmYield;

  const isDepreciated = farmRoi === 0;

  let farmItemConfig: any = {
    name: farmInfo.name,
    icon: farmInfo.icon,
    stakingTokenLink: farmInfo.stakingTokenLink,
    id: farmInfo.id,
    farmId: farmInfo.farmId,
    stakingTokenName: farmInfo.stakingTokenName,
    stakingTokenContract,
    contractInstance,
    contractAddress: farmInfo.contract.address,
    farmRoi,
    isDepreciated,
  };

  if (isExtended)
    farmItemConfig.farmTvl = await getTVL(
      poolInfo.stakingTokenTotalAmount,
      +lpPrice!
    );

  if (account) {
    //todo check for positions page
    const farmUserInfoConfig = {
      ...farmItemConfig,
      farmId: farmInfo.farmId,
      contractInstance,
      stakingTokenContract,
      lpPrice,
      depositedBalance: farmInfo.depositedBalance,
      contractAddress: farmInfo.contract.address,
      farmYield,
    };

    farmItemConfig.accountInfo = await getFarmUserInfo(farmUserInfoConfig);

    return markRaw(farmItemConfig);
  }
  return markRaw(farmItemConfig);
};

const getTokensPrices = async () => {
  const tokenAddressesArray = [
    tokenAddresses.SPELL,
    tokenAddresses.MIM,
    tokenAddresses.WETH,
  ];

  const tokensPrices = await getTokensArrayPrices(1, tokenAddressesArray);

  let SPELLPrice = 0,
    MIMPrice = 0,
    WETHPrice = 0;

  if (tokensPrices)
    tokensPrices.map((token: any) => {
      switch (token.address) {
        case tokenAddresses.SPELL:
          SPELLPrice = token.price;
          break;
        case tokenAddresses.MIM:
          MIMPrice = token.price;
          break;
        case tokenAddresses.WETH:
          WETHPrice = token.price;
          break;
      }
    });

  return {
    SPELLPrice,
    MIMPrice,
    WETHPrice,
  };
};

const getDefaultSigner = (chainId: number) => {
  let networksRpc: any = {
    1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    250: "https://rpc.ftm.tools/",
    42161: "https://arb1.arbitrum.io/rpc",
    43114: "https://api.avax.network/ext/bc/C/rpc",
  };

  return new ethers.providers.StaticJsonRpcProvider(networksRpc[chainId]);
};
