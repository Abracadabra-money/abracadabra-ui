import { Contract, type providers } from "ethers";

export const getContracts = async (
  provider: providers.BaseProvider,
  lvlConfig: any
) => {
  const { master, harvestor, senior, mezzanine, junior } = lvlConfig;

  const tokenConfugsArr = [senior, mezzanine, junior];

  const levelMasterContract = await new Contract(
    master.address,
    JSON.stringify(master.abi),
    provider
  );

  const harvestorContract = await new Contract(
    harvestor.address,
    JSON.stringify(harvestor.abi),
    provider
  );

  const tokenContracts = await Promise.all(
    tokenConfugsArr.map(async (config: any) => {
      const mainToken = await new Contract(
        config.mainToken.address,
        JSON.stringify(config.mainToken.abi),
        provider
      );

      const stakeToken = await new Contract(
        config.stakeToken.address,
        JSON.stringify(config.stakeToken.abi),
        provider
      );

      const oracle = await new Contract(
        config.oracle.address,
        JSON.stringify(config.oracle.abi),
        provider
      );

      return {
        name: config.name,
        mainToken,
        stakeToken,
        oracle,
      };
    })
  );

  return { levelMasterContract, harvestorContract, tokenContracts };
};
