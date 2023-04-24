import { Contract, providers } from "ethers";
import { MulticallWrapper } from "ethers-multicall-provider";
import cauldronsConfig from "@/utils/cauldronsConfig";


const lensAddress = "0x73f52bd9e59edbdf5cf0dd59126cef00ecc31528";
import lensAbi from "@/utils/abi/marketLens.js"

export const getUserPositionsUsingLens = async (
  chainId: number,
  user: string,
  provider: providers.BaseProvider,
): Promise<any[]> => {

  const multicalProvider = MulticallWrapper.wrap(provider);

  const configs: any[] = cauldronsConfig.filter(
    (config) => config.chainId === chainId
  );

  const lensContract = new Contract(
    lensAddress,
    lensAbi,
    multicalProvider
  );

  const oracleRates = await Promise.all(
    configs.map((config) => {
      return lensContract.getOracleExchangeRate(config.contract.address).catch(() => null)
    } )
  );

  const liquidationPrices = await Promise.all(
    configs.map((config) => {
      return lensContract.getUserLiquidationPrice(config.contract.address, user).catch(() => null)
    } )
  );

  const positions = await Promise.all(
    configs.map((config) => {
      return lensContract.getUserPosition(config.contract.address, user).catch(() => null)
    } )
  );

  return configs.map((config, idx) => {
    return {
      config,
      oracleRate: oracleRates[idx],
      position: positions[idx],
      liquidationPrice: liquidationPrices[idx],
    };
  });
};
