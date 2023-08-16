import { markRaw } from "vue";
import { Signer, ethers } from "ethers";
import { getTokensArrayPrices } from "@/helpers/priceHelper.js";
import { getFarmYieldAndLpPrice } from "@/helpers/farm/getFarmYieldAndLpPrice";
import { getRoi } from "@/helpers/farm/getRoi";
import { getTVL } from "@/helpers/farm/getTVL";
import { getFarmUserInfo } from "@/helpers/farm/getFarmUserInfo";
import farmsConfig from "@/utils/farmsConfig/farms";
import store from "@/store";

import type { FarmConfig, FarmItem, PoolInfo } from "@/utils/farmsConfig/types";

type TokenPrices = {
  SPELLPrice: number;
  MIMPrice: number;
};

type TokenPricesResponse = {
  address: string;
  price: number;
};

export const tokenAddresses = {
  SPELL: "0x090185f2135308bad17527004364ebcc2d37e5f6",
  MIM: "0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3",
  WETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
};

export const createFarmItemConfig = async (
  farmId: number | string,
  chainId: number,
  signer: Signer,
  account: string | undefined,
  isExtended = true
): Promise<FarmItem | Boolean> => {
  const farmsOnChain = farmsConfig.filter(
    (farm) => farm.contractChain === chainId
  );

  const farmInfo: FarmConfig | undefined = farmsOnChain.find(
    ({ id }) => id === Number(farmId)
  );

  if (!farmInfo) return false;

  const { SPELLPrice, MIMPrice } = await getTokensPrices();

  if (!signer) signer = store.getters.getDefaultSigner(chainId);

  const contractInstance = new ethers.Contract(
    farmInfo.contract.address,
    JSON.stringify(farmInfo.contract.abi),
    signer
  );

  const poolInfo: PoolInfo = await contractInstance.poolInfo(farmInfo.poolId);

  const stakingTokenContract = new ethers.Contract(
    poolInfo.stakingToken,
    JSON.stringify(farmInfo.stakingToken.abi),
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

  const farmRoi = farmYield ? await getRoi(farmYield, SPELLPrice) : farmYield;

  const isDepreciated = farmRoi === 0;

  const farmItemConfig: FarmItem = {
    name: farmInfo.name,
    icon: farmInfo.icon,
    id: farmInfo.id,
    poolId: farmInfo.poolId,
    earnedTokenPrice: SPELLPrice,
    stakingToken: {
      link: farmInfo.stakingToken.link,
      name: farmInfo.stakingToken.name,
      type: farmInfo.stakingToken.type,
      contract: stakingTokenContract,
    },
    depositedBalance: farmInfo.depositedBalance,
    contractInstance,
    contractAddress: farmInfo.contract.address,
    farmRoi,
    farmYield,
    lpPrice,
    isDepreciated,
  };

  if (isExtended)
    farmItemConfig.farmTvl = await getTVL(
      poolInfo.stakingTokenTotalAmount,
      lpPrice!
    );

  if (account) {
    farmItemConfig.accountInfo = await getFarmUserInfo(farmItemConfig);
    return markRaw(farmItemConfig);
  }
  return markRaw(farmItemConfig);
};

const getTokensPrices = async (): Promise<TokenPrices> => {
  const tokenAddressesArray = [tokenAddresses.SPELL, tokenAddresses.MIM];

  const tokensPrices = await getTokensArrayPrices(1, tokenAddressesArray);

  let SPELLPrice = 0,
    MIMPrice = 0;

  if (tokensPrices)
    tokensPrices.map((token: TokenPricesResponse) => {
      switch (token.address) {
        case tokenAddresses.SPELL:
          SPELLPrice = token.price;
          break;
        case tokenAddresses.MIM:
          MIMPrice = token.price;
          break;
      }
    });

  return {
    SPELLPrice,
    MIMPrice,
  };
};
