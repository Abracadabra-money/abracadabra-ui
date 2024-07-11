import { actions } from "@/helpers/cauldron/cook/actions";

const repay = async (
  cookData,
  degenBoxHelperContract,
  toAddress,
  cauldronAddress,
  part,
  useValue1 = false,
  useValue2 = false,
  returnValues = 0
) => {
  try {
    const useReturnValue = useValue1 || useValue2;

    const repayPartTx =
      await degenBoxHelperContract.populateTransaction.repayPart(
        toAddress,
        cauldronAddress,
        useReturnValue ? "0" : part
      );

    const repayPartByte = useReturnValue
      ? repayPartTx.data.substr(0, 138)
      : repayPartTx.data;

    cookData = await actions.call(
      cookData,
      degenBoxHelperContract.address,
      repayPartByte,
      useValue1,
      useValue2,
      returnValues
    );

    return cookData;
  } catch (error) {
    console.log("getRepayPartEncode err:", error);
  }
};

export default repay;
