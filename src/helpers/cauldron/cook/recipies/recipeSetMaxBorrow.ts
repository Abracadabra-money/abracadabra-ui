import { actions } from "@/helpers/cauldron/cook/actions";

const recipeSetMaxBorrow = async (
  cookData: any,
  { whitelisterContract, userWhitelistedInfo }: any,
  user: string
): Promise<any> => {
  const setMaxBorrowTx =
    await whitelisterContract.populateTransaction.setMaxBorrow(
      user,
      userWhitelistedInfo.userBorrowPart,
      userWhitelistedInfo.proof
    );

  const data = setMaxBorrowTx.data;

  cookData = await actions.call(
    cookData,
    whitelisterContract.address,
    data,
    false,
    false,
    0
  );
  return cookData;
};

export default recipeSetMaxBorrow;
