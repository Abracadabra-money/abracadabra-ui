import { Contract } from "ethers";

export const getContracts = async (provider: any, config: any) => {
  const { harvestor, mainToken, stakeToken, oracle, chainLink } = config;

  const magicGlpContract = await new Contract(
    mainToken.address,
    JSON.stringify(mainToken.abi),
    provider
  );

  const glpContract = await new Contract(
    stakeToken.address,
    JSON.stringify(stakeToken.abi),
    provider
  );

  const harvestorContract = await new Contract(
    harvestor.address,
    JSON.stringify(harvestor.abi),
    provider
  );

  const oracleContract = await new Contract(
    oracle.address,
    JSON.stringify(oracle.abi),
    provider
  );

  const chainLinkContract = await new Contract(
    chainLink.address,
    JSON.stringify(chainLink.abi),
    provider
  );

  return {
    magicGlpContract,
    glpContract,
    harvestorContract,
    oracleContract,
    chainLinkContract,
  };
};
