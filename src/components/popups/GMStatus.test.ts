import Vuex from "vuex";
import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import GMStatusPopup from "@/components/popups/GMStatus.vue";
import { ethers } from "ethers";

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
      },
    },
  },
});

describe("GMStatusPopup", () => {
  it("renders correctly when isOpened is true", () => {
    const wrapper = shallowMount(GMStatusPopup, {
      global: { plugins: [store] },
      propsData: {
        isOpened: true,
        order: {},
        cauldronObject: {
          config: {
            chainId: 1,
          },
          contracts: {
            cauldron: {},
          },
        },
        orderType: 1,
        deleverageSuccessPayload: {},
        refundWeth: {},
        deleverageFromOrder: {},
        successLeverageCallback: {},
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".popup-wrap").isVisible()).toBe(true);
  });

  it("renders correctly when isOpened is false", () => {
    const wrapper = shallowMount(GMStatusPopup, {
      global: { plugins: [store] },
      propsData: {
        isOpened: false,
        order: {},
        cauldronObject: {
          config: {
            chainId: 1,
          },
          contracts: {
            cauldron: {},
          },
        },
        orderType: 1,
        deleverageSuccessPayload: {},
        refundWeth: {},
        deleverageFromOrder: {},
        successLeverageCallback: {},
      },
    });

    expect(wrapper.exists()).toBe(true);
  });
});
