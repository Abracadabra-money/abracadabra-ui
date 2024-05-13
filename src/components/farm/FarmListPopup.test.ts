import Vuex from "vuex";
import { ethers, providers } from "ethers";
import { defaultRpc } from "@/helpers/chains";
import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import FarmListPopup from "@/components/farm/FarmListPopup.vue";

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
        getSigner: () => new providers.StaticJsonRpcProvider(defaultRpc[1]),
        provider: () => new providers.StaticJsonRpcProvider(defaultRpc[1]),
      },
    },
  },
});

describe("FarmListPopup", () => {
  it("renders the popup title correctly", () => {
    const wrapper = shallowMount(FarmListPopup, {
      global: { plugins: [store] },
      created() {},
    });
    const title = wrapper.find(".popup-title");
    expect(title.text()).toBe("Select Farm");
  });

  it("displays the loader when farms are loading", async () => {
    const wrapper = shallowMount(FarmListPopup, {
      global: { plugins: [store] },
      created() {},
    });
    wrapper.setData({ isFarmsLoading: true });
    await wrapper.vm.$nextTick();
    const loader = wrapper.findComponent({ name: "BaseLoader" });
    expect(loader.exists()).toBe(true);
  });
});
