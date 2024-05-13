import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import ClaimMimBlock from "@/components/stake/spell/ClaimMimBlock.vue";
import Vuex from "vuex";
import { ethers } from "ethers";

const store = new Vuex.Store({
  modules: {
    connectProvider: {
      state: { account: ethers.Wallet.createRandom() },
      getters: {
        getAccount: (state) => state.account,
      },
    },
  },
});

describe("ClaimMimBlock", () => {
  it("renders the correct button text when account is null and isUnsupportedChain is true", () => {
    const store = new Vuex.Store({
      modules: {
        connectProvider: {
          state: { account: null },
          getters: {
            getAccount: (state) => state.account,
          },
        },
      },
    });

    const wrapper = shallowMount(ClaimMimBlock, {
      propsData: {
        claimAmount: "100",
        isUnsupportedChain: true,
      },
      global: { plugins: [store] },
      mocks: {
        $emit: vi.fn(),
      },
    });

    expect(wrapper.find(".claim-button").text()).toBe("Connect wallet");
  });

  it("renders the correct button text when isUnsupportedChain is false", () => {
    const wrapper = shallowMount(ClaimMimBlock, {
      propsData: {
        claimAmount: "100",
        isUnsupportedChain: false,
      },
      global: { plugins: [store] },
      mocks: {
        $emit: vi.fn(),
      },
    });

    expect(wrapper.find(".claim-button").text()).toBe("Switch Network");
  });

  it("renders the correct button text when account is not null and isUnsupportedChain is true", () => {
    const wrapper = shallowMount(ClaimMimBlock, {
      propsData: {
        claimAmount: "100",
        isUnsupportedChain: true,
      },
      global: { plugins: [store] },
      mocks: {
        $emit: vi.fn(),
      },
    });

    expect(wrapper.find(".claim-button").text()).toBe("Claim");
  });

  it("formats the claim amount correctly", () => {
    const wrapper = shallowMount(ClaimMimBlock, {
      propsData: {
        claimAmount: "1000000000000000000",
        isUnsupportedChain: true,
      },
      global: { plugins: [store] },
      mocks: {
        $emit: vi.fn(),
      },
    });

    expect(wrapper.find(".token-amount").text()).toBe(
      "1,000,000,000,000,000,000"
    );
  });
});
