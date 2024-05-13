import { Contract } from "ethers";
import { formatToFixed } from "@/helpers/filters";
import { MulticallWrapper } from "ethers-multicall-provider";
import { getEthersProvider } from "@/helpers/chains/getChainsInfo";
import { config } from "@/helpers/collateralsApy/getMagicApeApy/config";

export const getMagicApeApy = async (chainId: number): Promise<number> => {
  const provider = getEthersProvider(chainId);

  const { magicApe, lens } = config;
  const multicallProvider = MulticallWrapper.wrap(provider);

  const magicApeContract = await new Contract(
    magicApe.address,
    JSON.stringify(magicApe.abi),
    multicallProvider
  );

  const magicApeLensContract = await new Contract(
    lens.address,
    JSON.stringify(lens.abi),
    multicallProvider
  );

  const [feePercentBips, bips, apeCoinInfo] = await Promise.all([
    magicApeContract.feePercentBips(),
    magicApeContract.BIPS(),
    magicApeLensContract.getApeCoinInfo(),
  ]);

  const fee = feePercentBips / bips;
  const apr = apeCoinInfo[0] / 100;
  return +formatToFixed(
    (Math.pow(1 + apr / 100 / 730, 730) - 1) * 100 * (1 - fee),
    2
  );
};
