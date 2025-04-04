import Vuex from "vuex";
import { ethers } from "ethers";
import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import CrvStakePopup from "@/components/popups/CrvStakePopup.vue";

const store = new Vuex.Store({
  modules: {
    connectProvider: {
      state: {
        chainId: 1,
        account: ethers.Wallet.createRandom(),
      },
      getters: {
        getChainId: (state) => state.chainId,
        getAccount: (state) => state.account,
        getPopupData: () => {},
      },
    },
  },
});

const clickOutside = vi.fn();

describe("CrvStakePopup", () => {
  it("renders correctly", () => {
    const wrapper = shallowMount(CrvStakePopup, {
      global: { plugins: [store] },
      directives: { clickOutside },
      method: {
        createStakeInfo: () => vi.fn(),
      },
      created() {
        vi.fn();
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
