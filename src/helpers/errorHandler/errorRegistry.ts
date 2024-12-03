type AbraError = {
  template: string;
  isDevOnly?: boolean;
  isShowToUser?: boolean;
}

export const errorRegistry = {
  GENERIC_ERROR: {
    template: "Something went wrong.",
  },

  // Custom errors___________________
  CUSTOM_TEST_ERROR: {
    template: "Example of custom errors.",
  },
  //_________________________________

  VIEM_ERROR: {
    template: "{message}",
  },

  AXIOS_ERROR: {
    template: "Axios error",
  }
};
