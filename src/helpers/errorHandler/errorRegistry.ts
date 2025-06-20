type AbraError = {
  template: string;
  isDevOnly?: boolean;
  isShowToUser?: boolean;
};

export const errorRegistry = {
  GENERIC_ERROR: {
    template: "Something went wrong.",
  },

  // Custom errors___________________
  CUSTOM_TEST_ERROR: {
    template: "Example of custom errors.",
  },
  CUSTOM_LIQUIDITY_TOO_LOW: {
    template: "Initial liquidity amount is too low, please, add more",
  },
  //_________________________________

  VIEM_ERROR: {
    template: "{message}",
  },

  VIEM_BALANCE_ERROR: {
    template: "Insufficient balance for transfer",
  },

  AXIOS_ERROR: {
    template: "Axios error",
  },
};
