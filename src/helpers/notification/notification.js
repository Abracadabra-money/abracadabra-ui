export default {
  success: {
    msg: `Transaction Success`,
    type: "success",
  },

  clipboard: {
    msg: `Copied RPC link to clipboard`,
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

  whitelisted: {
    msg: "Your wallet is not currently whitelisted. Please try again once the whitelist is removed.",
    type: "error",
  },

  tenderlyMod: {
    msg: "You have Tenderly mod enabled. Make sure that Fork is selected in your wallet. Or log out.",
    type: "warning",
  },

  sanctionAddress: {
    title: "Sanction address Warning",
    msg: "It looks like the address you have connected to Abracadabra UI is on a Sanction List. Abracadabra Money is not offering services to sanctioned addresses.",
    type: "error",
  },
  tenderlyPending: {
    discription: "Transaction in progress",
    type: "pending",
  },
};
