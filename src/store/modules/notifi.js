import { arrayify } from "ethers/lib/utils";
import { signMessageHelper } from "@/helpers/walletClienHelper.ts";

export default {
  getters: {
    getNotifiSignMessage: (_state) => {
      return async (message) => {
        const stringMessage = new TextDecoder("utf-8").decode(message);
        const result = await signMessageHelper(stringMessage);
        return arrayify(result);
      };
    },
    getNotifiCardId: (_state, rootState) => {
      switch (rootState.getChainId) {
        case 1:
          return "0197538567c276b28848e2c4dd4bf497";
        case 43114: 
          return "019753874ef8758baf463de44988503a";
        case 56:
          return "01975386bbde701f8b2910680f2cbc0a";
        case 42161:
          return "0197538624c97075bf179ef9b2284530";
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
