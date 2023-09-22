export const notificationErrorMsg = (e, type = "") => {
  let msg = null;

  if (
    e?.message === "MetaMask Tx Signature: User denied transaction signature."
  ) {
    msg = "User denied transaction signature";
  }

  if (e?.message.indexOf("user rejected transaction")) {
    msg = "User rejected transaction";
  }

  if (
    String(e).indexOf("Borrow Limit reached") !== -1 ||
    String(e).indexOf("Whitelisted borrow exceeded") !== -1 ||
    e?.data?.message === "Borrow Limit reached: execution reverted" ||
    e?.data?.message === "Whitelisted borrow exceeded: execution reverted" ||
    e?.data?.message === "execution reverted: Borrow Limit reached" ||
    e?.message === "execution reverted: Borrow Limit reached"
  ) {
    msg =
      "The amount you are borrowing is higher than the maximum per wallet allowance. Please borrow less and try again.";
  }

  if (e?.error === "execution reverted: Cauldron: user insolvent") {
    msg =
      "Looks like your transaction is likely to fail due to swap tolerance settings, please increase your swap tolerance!";
  }

  if (
    e?.error?.message === "execution reverted: BoringMath: Underflow" ||
    e?.data?.message === "execution reverted: BoringMath: Underflow"
  ) {
    msg =
      "Looks like your transaction is likely to fail due to swap tolerance settings, please increase your swap tolerance!";
  }

  if (
    e?.code === "UNPREDICTABLE_GAS_LIMIT" ||
    e?.data?.message === "execution reverted: Cauldron: call failed"
  ) {
    msg =
      "Looks like your transaction is likely to fail due to slippage settings, please increase your slippage!";
  }

  if (
    String(e).indexOf("RewardTracker: burn amount exceeds balance") !== -1 ||
    e?.data?.message ===
      "execution reverted: RewardTracker: burn amount exceeds balance" ||
    e?.message ===
      "execution reverted: RewardTracker: burn amount exceeds balance"
  ) {
    msg =
      "Some of your GLP tokens are reserved for vesting on gmx. Please insert the amount that is not reserved for vesting";
  }

  if (
    (String(e).indexOf(`BoringERC20: TransferFrom failed`) !== -1 ||
      e?.data?.message === `BoringERC20: TransferFrom failed` ||
      e?.message === `BoringERC20: TransferFrom failed`) &&
    type === "mklp"
  ) {
    msg =
      "Kintetix Finance applies a 15 minutes lock on all freshly minted KLP. Please wait 15 minutes and try again.";
  }

  if (!msg) msg = "Transaction encountered an Error";

  return msg;
};

export const notificationMsg = () => {};
