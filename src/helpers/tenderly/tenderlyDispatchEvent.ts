import {
  TENDERLY_EVENT_CHANGED_DATA,
  TENDERLY_FORK_DATA,
} from "@/constants/tenderly";

export const tenderlyDispatchEvent = () => {
  window.dispatchEvent(
    new CustomEvent(TENDERLY_EVENT_CHANGED_DATA, {
      detail: {
        storage: localStorage.getItem(TENDERLY_FORK_DATA),
      },
    })
  );
};
