import type { providers } from "ethers";
import type { UserTokensInfo } from "@/helpers/cauldron/types";

export const getUserTokensInfo = async (
  contracts: any,
  account: string | undefined,
  signer: providers.JsonRpcSigner
): Promise<UserTokensInfo | null> => {
  if (!account) return null;

  const multicallArr = [
    contracts.collateral.balanceOf(account),
    contracts.mim.balanceOf(account),
    signer.getBalance(),
    contracts.collateral.allowance(account, contracts.bentoBox.address),
    contracts.mim.allowance(account, contracts.bentoBox.address),
  ];

  if (contracts.unwrappedToken) {
    multicallArr.push(contracts.unwrappedToken.balanceOf(account));
    multicallArr.push(
      contracts.unwrappedToken.allowance(account, contracts.bentoBox.address)
    );
  }

  const tokensInfo = await Promise.all(multicallArr);

  return {
    collateralBalance: tokensInfo[0],
    mimBalance: tokensInfo[1],
    nativeTokenBalance: tokensInfo[2],
    collateralAllowance: tokensInfo[3],
    mimAllowance: tokensInfo[4],
    unwrappedTokenBalance: tokensInfo[5] || null,
    unwrappedTokenAllowance: tokensInfo[6] || null,
  };
};
