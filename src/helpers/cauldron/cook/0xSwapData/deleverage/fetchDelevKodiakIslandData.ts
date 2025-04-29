import { parseAbi } from "viem";
import { utils, type BigNumber } from "ethers";
import type { PublicClient, Address } from "viem";
import { BERA_CHAIN_ID } from "@/constants/global";
import { swapOogaBoogaRequest } from "@/helpers/oogaBooga";
import type { CauldronInfo } from "@/helpers/cauldron/types";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import kodiakIslandRouter from "@/helpers/bera/kodiakIslandRouter";

export const fetchDelevKodiakIslandData = async (
  cauldronObject: CauldronInfo,
  amount: BigNumber,
  slippage: number,
  to: Address
) => {
  //@ts-ignore
  const { collateral, liquidationSwapper, mim } = cauldronObject.contracts;

  const kodiakVaultAddress =
    cauldronObject.config.wrapInfo!.unwrappedToken.address;

  const lpContractInfo = {
    address: kodiakVaultAddress,
    abi: parseAbi([
      "function token0() view returns (address token0)",
      "function token1() view returns (address token1)",
    ]),
  };

  const publicClient: PublicClient = getPublicClient(BERA_CHAIN_ID);

  const [{ result: token0Address }, { result: token1Address }] =
    await publicClient.multicall({
      contracts: [
        {
          ...lpContractInfo,
          functionName: "token0",
          args: [],
        },
        {
          ...lpContractInfo,
          functionName: "token1",
          args: [],
        },
      ],
    });

  const kodiakVaultAmount = await collateral.convertToAssets(amount);

  const removeLiquidityPreview =
    await kodiakIslandRouter.removeLiquidityPreview(
      kodiakVaultAmount,
      kodiakVaultAddress,
      to
    );

  const token0SwapResult = await swapOogaBoogaRequest(
    mim.address as Address,
    token0Address!,
    slippage,
    removeLiquidityPreview!.amount0,
    liquidationSwapper!.address as Address
  );

  const token1SwapResult = await swapOogaBoogaRequest(
    mim.address as Address,
    token1Address!,
    slippage,
    removeLiquidityPreview!.amount1,
    liquidationSwapper!.address as Address
  );

  return utils.defaultAbiCoder.encode(
    ["address[]", "bytes[]"],
    [
      [token0SwapResult!.to, token1SwapResult!.to],
      [token0SwapResult!.data, token1SwapResult!.data],
    ]
  );
};
