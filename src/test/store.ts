import Vuex from "vuex";
import { providers } from "ethers";
import { chains } from "@/helpers/chains";
import { defaultRpc } from "@/helpers/chains";

export const testStore = new Vuex.Store({
  modules: {
    connectProvider: {
      state: {
        chainId: 1,
        account: "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
        networks: chains,
      },
      getters: {
        getChainId: (state) => state.chainId,
        getAccount: (state) => state.account,
        getSigner: () => new providers.StaticJsonRpcProvider(defaultRpc[1]),
        getEnsName: () => null,
        getAvailableNetworks: (state) => state.networks,
        getNotifiCardId: () => {
          return "eb0d573373194bbcbda52bda19221c71";
        },
        getNotifiWalletBlockchain: () => {
          return "ETHEREUM";
        },
      },
      mutations: {
        setMobileMenu(state, show) {
          state.mobileMenu = show;
        },

        setPopupState(state, { type, isShow, data }) {
          state.popupData = data;
          state.popupType = type;
          state.showPopup = isShow;
        },

        closePopups(state) {
          state.popupType = null;
          state.showPopup = false;
          state.popupData = null;
        },
      },
    },
  },
});

export const testEmptyStore = new Vuex.Store({
  modules: {
    connectProvider: {
      getters: {
        getChainId: () => null,
        getAccount: () => null,
        getSigner: () => null,
        getEnsName: () => null,
      },
    },
  },
});

export const getTestStore = (
  chainId: number,
  account: string,
  ensName: string
) =>
  new Vuex.Store({
    modules: {
      connectProvider: {
        state: {
          chainId,
          account,
          ensName,
        },
        getters: {
          getChainId: (state) => state.chainId,
          getAccount: (state) => state.account,
          getSigner: () => new providers.StaticJsonRpcProvider(defaultRpc[1]),
          getEnsName: (state) => state.ensName,
        },
      },
    },
  });
