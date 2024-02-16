import Vuex from "vuex";
import { Wallet } from "ethers";
import { describe, it, expect, vi } from "vitest";
import { mount, shallowMount } from "@vue/test-utils";
import BentoBoxItem from "@/components/myPositions/BentoBoxItem.vue";
import BentoBoxBlock from "@/components/myPositions/BentoBoxBlock.vue";

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

describe("BentoBoxBlock", () => {
  it("renders BentoBoxItem components when activeChains.degen.length is greater than 0", () => {
    const wrapper = mount(BentoBoxBlock, {
      global: { plugins: [store] },
      data(): any {
        return {
          activeDegenChain: 1,
        };
      },
      computed: {
        activeChains() {
          return {
            degen: [{ chainId: 1, mimInDegenBalance: 100n }],
            bento: [],
          };
        },
        activeChainDegenConfig() {
          return {};
        },
      },
      created() {},
    });

    const bentoBoxItems = wrapper.findAllComponents(BentoBoxItem);

    expect(bentoBoxItems.length).toBe(1);
  });

  it("renders BentoBoxItem components when activeChains.bento.length is greater than 0", () => {
    const wrapper = shallowMount(BentoBoxBlock, {
      global: { plugins: [store] },
      data(): any {
        return {
          activeDegenChain: 2,
        };
      },
      computed: {
        activeChains() {
          return {
            degen: [],
            bento: [{ chainId: 2 }],
          };
        },
        activeChainBentoConfig() {
          return {};
        },
      },
      created() {},
    });

    const bentoBoxItems = wrapper.findAllComponents(BentoBoxItem);
    expect(bentoBoxItems.length).toBe(1);
  });

  it("does not render BentoBoxItem components when activeChains.degen.length and activeChains.bento.length are 0", () => {
    const wrapper = shallowMount(BentoBoxBlock, {
      global: { plugins: [store] },
      data(): any {
        return {
          activeDegenChain: 1,
        };
      },
      computed: {
        activeChains() {
          return {
            degen: [],
            bento: [],
          };
        },
        activeChainDegenConfig() {
          return {};
        },
      },
      created() {},
    });

    const bentoBoxItems = wrapper.findAllComponents(BentoBoxItem);
    expect(bentoBoxItems.length).toBe(0);
  });

  it("opens the popup when @withdraw event is emitted with false", () => {
    const wrapper: any = shallowMount(BentoBoxBlock, {
      global: { plugins: [store] },
      data(): any {
        return {
          activeDegenChain: 1,
        };
      },
      computed: {
        activeChains() {
          return {
            degen: [{ chainId: 1, mimInDegenBalance: 100n }],
            bento: [],
          };
        },
        activeChainDegenConfig() {
          return {};
        },
      },
      created() {},
    });
    wrapper.vm.openPopup = vi.fn();

    wrapper.findComponent(BentoBoxItem).vm.$emit("withdraw", false);

    expect(wrapper.vm.openPopup).toHaveBeenCalledWith(false);
  });

  it("opens the popup when @withdraw event is emitted with true", () => {
    const wrapper: any = shallowMount(BentoBoxBlock, {
      global: { plugins: [store] },
      data(): any {
        return {
          activeDegenChain: 1,
        };
      },
      computed: {
        activeChains() {
          return {
            degen: [{ chainId: 1, mimInDegenBalance: 100n }],
            bento: [],
          };
        },
        activeChainDegenConfig() {
          return {};
        },
      },
      created() {},
    });
    wrapper.vm.openPopup = vi.fn();

    wrapper.findComponent(BentoBoxItem).vm.$emit("withdraw", true);

    expect(wrapper.vm.openPopup).toHaveBeenCalled();
  });
});
