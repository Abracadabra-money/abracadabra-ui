import { actions } from "@/helpers/cauldron/cook/actions";

const bentoWithdraw = async (
  cookData,
  degenBoxHelperContract,
  tokenAddress,
  toAddress,
  amount,
  share,
  useValue1 = false,
  useValue2 = false,
  returnValues = 0
) => {
  try {
    const useReturnValue = useValue1 || useValue2;

    const degenBoxWithdrawTx =
      await degenBoxHelperContract.populateTransaction.degenBoxWithdraw(
        tokenAddress,
        toAddress,
        useReturnValue ? "0" : amount,
        useReturnValue ? "0" : share
      );

    const degenBoxWithdrawByte = useReturnValue
      ? degenBoxWithdrawTx.data.substr(0, 202)
      : degenBoxWithdrawTx.data;

    cookData = await actions.call(
      cookData,
      degenBoxHelperContract.address,
      degenBoxWithdrawByte,
      useValue1,
      useValue2,
      returnValues
    );

    return cookData;
  } catch (error) {
    console.log("degenBoxWithdrawEncode err:", error);
  }
};

export default bentoWithdraw;
