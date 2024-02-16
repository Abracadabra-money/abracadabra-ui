import Vuex from "vuex";
import { Wallet } from "ethers";
import { shallowMount } from "@vue/test-utils";
import type { VueWrapper } from "@vue/test-utils";
import type { ComponentPublicInstance } from "vue";
import MimTokenBlock from "@/components/ui/MimTokenBlock.vue";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

const store = new Vuex.Store({
  modules: {
    connectProvider: {
      state: {
        chainId: 1,
        account: Wallet.createRandom(),
      },
      getters: {
        getChainId: (state) => state.chainId,
        getAccount: (state) => state.account,
      },
    },
  },
});

describe("MimTokenBlock", () => {
  let wrapper: VueWrapper<ComponentPublicInstance> | null = null;

  beforeEach(() => {
    wrapper = shallowMount(MimTokenBlock, { global: { plugins: [store] } });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it("renders the MimTokenBlock component", () => {
    expect(wrapper?.exists()).toBe(true);
  });

  it("displays the Mim token price if mimPrice is not null", async () => {
    wrapper?.setData?.({ mimPrice: 1.2345 });
    await wrapper?.vm.$nextTick?.();

    const mimPriceElement = wrapper?.find?.(".mim-price");
    expect(mimPriceElement?.exists()).toBe(true);
    expect(mimPriceElement?.text()).toBe("$ 1.2344");
  });

  it("does not display the Mim token price if mimPrice is null", async () => {
    if (wrapper) {
      wrapper.setData({ mimPrice: null });
      await wrapper.vm.$nextTick();

      const mimPriceElement = wrapper.find(".mim-price");
      expect(mimPriceElement.exists()).toBe(false);
    }
  });
});
