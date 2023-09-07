export const getSetMaxBorrowData = async (
    contract,
    account,
    userBorrowPart,
    proof
  ) => {
    try {
      const setMaxBorrowTx = await contract.populateTransaction.setMaxBorrow(
        account,
        userBorrowPart,
        proof
      );
  
      return setMaxBorrowTx.data;
    } catch (e) {
      console.log("getSetMaxBorrowData error:", e);
    }
  };