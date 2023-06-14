import store from "@/store";
import type { Contract } from "ethers";
import notification from "@/helpers/notification/notification.js";
import { APPROVE_AMOUNT, APPROVE_GAS_LIMIT } from "@/constants/approve";

export const approveToken = async (contract: Contract, spender: string) => {
  const notificationId = await store.dispatch(
    "notifications/new",
    notification.approvePending
  );

  try {
    const estimateGas = await contract.estimateGas.approve(
      spender,
      APPROVE_AMOUNT
    );

    const gasLimit = APPROVE_GAS_LIMIT + +estimateGas.toString();

    const tx = await contract.approve(spender, APPROVE_AMOUNT, {
      gasLimit,
    });

    await tx.wait();
    await store.commit("notifications/delete", notificationId);
  } catch (error) {
    console.log("Approve Token:", error);
    await store.dispatch("notifications/new", notification.approveError);
  }
};
