import store from "@/store";
import { ARBITRUM_CHAIN_ID, MAINNET_CHAIN_ID } from "@/constants/global";
import { BigNumber, providers, utils } from "ethers";
import type { CauldronListItem } from "../cauldron/lists/getMarketList";
import { getMarketsApr } from "@/helpers/gm/apr/getMarketApr";
import { getCrvApy } from "@/helpers/collateralsApy/getCrvApy";
import { getLUSDApy } from "@/helpers/collateralsApy/getLUSDApy";
import { getElixirApy } from "@/helpers/collateralsApy/getElixirApy";
import { getMagicGlpApy } from "@/helpers/collateralsApy/getMagicGlpApy";
import { getUsd0ppApy } from "./getUsd0ppApy";
import {
  GM_ARB,
  GM_SOL,
  GM_ETH,
  GM_BTC,
  GM_LINK,
  GM_BTC_BTC,
  GM_ETH_ETH,
} from "@/constants/gm";
import { BASIS_POINTS_DIVISOR } from "../gm/applySlippageToMinOut";
import { ABRA_FEES } from "@/helpers/collateralsApy/getGMApr";
import type { Address } from "viem";
import { getEthersProvider } from "../chains/getChainsInfo";

const LUSD_CAULDRON_ADDRESS = "0x8227965A7f42956549aFaEc319F4E444aa438Df5";
const USD0_CAULDRON_ADDRESS = "0xE8ed7455fa1b2a3D8959cD2D59c7f136a45BF341";
export const fetchCauldronsAprs = async (cauldrons: CauldronListItem[]) => {
  // const provider = store.getters.getProvider;
  const provider = getEthersProvider(MAINNET_CHAIN_ID);

  const aprFetchingTasks = [
    //temporarily
    //@ts-ignore
    getAndFormatApr(LUSD_CAULDRON_ADDRESS, getLUSDApy, provider),
    filterCrvCauldronsAndGetAprs(cauldrons, provider),
    getAndFormatElixirApr(),
    getAndFormatApr(USD0_CAULDRON_ADDRESS, getUsd0ppApy),
    getAndFormatGlpAprs(),
    getGmCauldronsAprs(cauldrons, provider),
  ];

  try {
    const results = (
      await Promise.all(
        aprFetchingTasks.map((task) => task.catch(() => undefined))
      )
    ).flat(2);

    return results
      .filter((result: any) => result)
      .reduce((acc, curr) => ({ ...acc, ...curr }), {});
  } catch {
    return {};
  }
};

const filterCrvCauldronsAndGetAprs = async (
  cauldrons: CauldronListItem[],
  provider: providers.StaticJsonRpcProvider
) => {
  const crvCauldronsIds = [16, 24, 25];

  const crvCauldrons = cauldrons.filter(
    ({ config }) =>
      config.chainId === MAINNET_CHAIN_ID && crvCauldronsIds.includes(config.id)
  );

  return (
    await Promise.all(
      crvCauldrons.map(async (cauldron) => {
        let crvCauldronApr;

        if (cauldron.config.id === 16) {
          crvCauldronApr = await getCrvApy(
            cauldron,
            "0x9d5c5e364d81dab193b72db9e9be9d8ee669b652",
            provider
          );
        } else {
          crvCauldronApr = await getCrvApy(
            cauldron,
            "0x689440f2Ff927E1f24c72F1087E1FAF471eCe1c8",
            provider
          );
        }

        return crvCauldronApr
          ? {
              [cauldron.config.contract.address.toLowerCase()]: crvCauldronApr,
            }
          : undefined;
      })
    )
  ).filter((apr) => apr);
};

const getAndFormatElixirApr = async () => {
  const elixirApr = await getElixirApy();
  const elixirCauldronsAddresses = [
    "0x38E7D1e4E2dE5b06b6fc9A91C2c37828854A41bb",
    "0x00380CB5858664078F2289180CC32F74440AC923",
  ];

  return elixirCauldronsAddresses.map((address) => {
    return { [address.toLowerCase()]: elixirApr };
  });
};

const getAndFormatGlpAprs = async () => {
  const GlpCauldronAddress =
    "0x5698135CA439f21a57bDdbe8b582C62f090406D5".toLowerCase();
  const MagicGlpCauldronAddress =
    "0x726413d7402fF180609d0EBc79506df8633701B1".toLowerCase();

  const response = await getMagicGlpApy(ARBITRUM_CHAIN_ID);

  return [
    { [GlpCauldronAddress]: response.glpApy },
    { [MagicGlpCauldronAddress]: response.magicGlpApy },
  ];
};

const getGmCauldronsAprs = async (
  cauldrons: CauldronListItem[],
  provider: providers.StaticJsonRpcProvider
) => {
  const marketsApr = await getMarketsApr(provider);
  const marketAddresses = [
    GM_ARB,
    GM_SOL,
    GM_ETH,
    GM_BTC,
    GM_LINK,
    GM_BTC_BTC,
    GM_ETH_ETH,
  ];

  return marketAddresses.map((marketAddress) => {
    const aprData = BigNumber.from(
      marketsApr.marketsTokensAPRData[marketAddress.toLowerCase()]
    );
    const incentiveAprData = BigNumber.from(
      marketsApr.marketsTokensIncentiveAprData[marketAddress.toLowerCase()]
    );

    const feesBasicPoints = BASIS_POINTS_DIVISOR - ABRA_FEES;
    const bonusApr = incentiveAprData
      .mul(feesBasicPoints)
      .div(BASIS_POINTS_DIVISOR);

    const apr = aprData.add(bonusApr);

    const cauldronContractAddress = cauldrons.find(
      ({ config }) =>
        config.collateralInfo.address.toLowerCase() ===
        marketAddress.toLowerCase()
    )?.config.contract.address;

    return apr && cauldronContractAddress
      ? {
          [cauldronContractAddress.toLowerCase()]: Number(
            utils.formatUnits(apr, 2)
          ),
        }
      : undefined;
  });
};

const getAndFormatApr = async (
  cauldronAddress: string,
  aprFetchingFunction: (args?: any) => Promise<number>,
  fetchingFunctionArgs?: any
) => {
  const apr = fetchingFunctionArgs
    ? await aprFetchingFunction(fetchingFunctionArgs)
    : await aprFetchingFunction();

  return apr ? [{ [cauldronAddress.toLowerCase()]: apr }] : undefined;
};
