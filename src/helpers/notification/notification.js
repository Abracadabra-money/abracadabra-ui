export default {
  success: {
    msg: `Transaction Success`,
    type: "success",
  },

  pending: {
    discription: "Confirm in wallet and wait for confirmation",
    type: "pending",
  },

  error: {
    msg: "Transaction encountered an Error",
    type: "error",
  },

  approvePending: {
    discription: "Approve in progress",
    type: "pending",
  },

  approveError: {
    msg: "Unexpected Error",
    type: "error",
  },

  liquidation: {
    msg: "Opening such position will put you at an instant liquidation flag.",
    type: "error",
  },

  borrowSuccess: {
    msg: `Thanks for taking part in the innovation of MIM.
        Consider yourself extremely early in taking part in creating the 
        stablecoin that has no bias and knows no walls. $MIM- stable for
        everyone, everywhere`,
    type: "success",
  },

  beamNotAvailable: {
    msg: "The beam is not available on this network",
    type: "error",
  },

  allowBorrow: {
    msg: "This Lending Market has reached its MIM borrowable limit, please wait for the next MIM replenish to borrow more!",
    type: "error",
  },

  borrowLimit: {
    msg: "The amount you are borrowing is higher than the maximum per wallet allowance. Please borrow less and try again.",
    type: "error",
  },
};
