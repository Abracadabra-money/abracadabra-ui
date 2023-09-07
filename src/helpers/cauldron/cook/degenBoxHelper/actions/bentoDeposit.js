const bentoDeposit = async (
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
    const degenBoxDepositTx =
      await degenBoxHelperContract.populateTransaction.degenBoxDeposit(
        tokenAddress,
        toAddress,
        useReturnValue ? "0" : amount,
        useReturnValue ? "0" : share
      );

    const degenBoxDepositByte = useReturnValue
      ? degenBoxDepositTx.data.substr(0, 202)
      : degenBoxDepositTx.data;

    cookData = await actions.call(
      cookData,
      degenBoxHelperContract.address,
      degenBoxDepositByte,
      useValue1,
      useValue2,
      returnValues
    );

    return cookData;
  } catch (error) {
    console.log("getDegenBoxDepositEncode err:", error);
  }
};

export default bentoDeposit;
