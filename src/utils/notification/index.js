export default {
  approve: {
    pending: {
      discription: "Approve in progress",
      type: "pending",
    },
    error: {
      msg: "Unexpected Error",
      type: "error",
    },
  },
  transaction: {
    pending: {
      discription: "Transaction in progress",
      type: "pending",
    },
    successAddCollateral: {
      discription: "Thanks for taking part in the innovation of MIM.",
      msg: `Consider yourself extremely early in taking part in
        creating the stablecoin that has no bias and knows no walls.
        $MIM- stable for everyone, everywhere.`,
      type: "success",
    },
    success: {
      msg: `Transaction Success`,
      type: "success",
    },
    error: {
      msg: "Transaction in error",
      type: "error",
    },

    liquidation: {
      msg: "Opening such position will put you at an instant liquidation flag.",
      type: "error",
    },
  },

  allowBorrow: {
    msg: "This Lending Market has reached its MIM borrowable limit, please wait for the next MIM replenish to borrow more!",
    type: "info",
  },

  userDenied: {
    msg: "User denied transaction signature.",
    type: "error",
  },
  bridgeNotAvailable: {
    msg: "The bridge is not available on this network",
    type: "error",
  },
};
