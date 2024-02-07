import { arrayify } from "ethers/lib/utils";

export default {
  getters: {
    getNotifiSignMessage: (_state, rootState) => {
      return async (message) => {
        const stringMessage = new TextDecoder("utf-8").decode(message);
        const result = await rootState.getSigner.signMessage(stringMessage);
        return arrayify(result);
      };
    },
    getNotifiCardId: (_state, rootState) => {
      switch (rootState.getChainId) {
        case 1:
          return "eb0d573373194bbcbda52bda19221c71";
        case 43114:
          return "f2e2cf212b204257b056fa9fb550c354";
        case 56:
          return "4316dbeb5917458f98b7a4adca95f6a0";
        case 42161:
          return "b0049e6173a04727adb0e8ed13396fcf";
        default:
          return null;
      }
    },
    getNotifiWalletBlockchain: (_state, rootState) => {
      switch (rootState.getChainId) {
        case 1:
          return "ETHEREUM";
        case 43114:
          return "AVALANCHE";
        case 56:
          return "BINANCE";
        case 42161:
          return "ARBITRUM";
        default:
          return null;
      }
    },
  },
};
