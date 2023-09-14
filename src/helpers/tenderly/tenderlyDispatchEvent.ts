import {
  TENDERLY_CUSTOM_EVENT,
  TENDERLY_FORK_DATA,
} from "@/constants/tenderly";

export const tenderlyDispatchEvent = () => {
  window.dispatchEvent(
    new CustomEvent(TENDERLY_CUSTOM_EVENT, {
      detail: {
        storage: localStorage.getItem(TENDERLY_FORK_DATA),
      },
    })
  );
};
