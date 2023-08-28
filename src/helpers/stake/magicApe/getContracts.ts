import { Contract } from "ethers";

export const getContracts = async (provider: any, config: any) => {
  const { mainToken, stakeToken, oracle, chainLink } = config;

  const magicApeContract = await new Contract(
    mainToken.address,
    JSON.stringify(mainToken.abi),
    provider
  );

  const apeContract = await new Contract(
    stakeToken.address,
    JSON.stringify(stakeToken.abi),
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

  return { apeContract, magicApeContract, oracleContract, chainLinkContract };
};
