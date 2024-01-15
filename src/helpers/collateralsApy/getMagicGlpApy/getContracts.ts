import { providers, Contract } from "ethers";
import { MulticallWrapper } from "ethers-multicall-provider";
import { rpc } from "@/helpers/collateralsApy/getMagicGlpApy/constants";
import { contracts } from "@/helpers/collateralsApy/getMagicGlpApy/constants";

export const getContracts = async (chainId: number) => {
  const {
    glpManager,
    rewardReader,
    reader,
    gmxPool,
    vault,
    aggregator,
    magicGlpHarvestor,
  } = contracts[chainId as keyof typeof contracts];

  const provider = new providers.StaticJsonRpcProvider(
    rpc[chainId as keyof typeof rpc]
  );

  // NOTICE: BERA TEST
  const multicallProvider =
    chainId === 80085 ? provider : MulticallWrapper.wrap(provider);

  const glpManagerContract = new Contract(
    glpManager.address,
    JSON.stringify(glpManager.abi),
    multicallProvider
  );

  const rewardReaderContract = new Contract(
    rewardReader.address,
    JSON.stringify(rewardReader.abi),
    multicallProvider
  );

  const readerContract = new Contract(
    reader.address,
    JSON.stringify(reader.abi),
    multicallProvider
  );
  // gmxPoolContract
  const gmxPoolContract = new Contract(
    gmxPool.address,
    JSON.stringify(gmxPool.abi),
    multicallProvider
  );

  const vaultContract = new Contract(
    vault.address,
    JSON.stringify(vault.abi),
    multicallProvider
  );

  const aggregatorContract = new Contract(
    aggregator.address,
    JSON.stringify(aggregator.abi),
    multicallProvider
  );

  const magicGlpHarvestorContract = new Contract(
    magicGlpHarvestor.address,
    JSON.stringify(magicGlpHarvestor.abi),
    multicallProvider
  );

  return {
    glpManagerContract,
    rewardReaderContract,
    readerContract,
    gmxPoolContract,
    vaultContract,
    aggregatorContract,
    magicGlpHarvestorContract,
  };
};
