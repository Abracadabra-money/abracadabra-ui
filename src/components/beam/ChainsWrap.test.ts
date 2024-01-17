import Vuex from "vuex";
import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import ChainsWrap from "@/components/beam/ChainsWrap.vue";
import { ethers } from "ethers";

const store = new Vuex.Store({
  modules: {
    connectProvider: {
      state: {
        account: ethers.Wallet.createRandom(),
      },
      getters: {
        getAccount: (state) => state.account,
      },
    },
  },
});

describe("ChainsWrap", () => {
  it("renders correctly", () => {
    const wrapper = shallowMount(ChainsWrap, {
      propsData: {
        selectChain: true,
        fromChain: {
          title: "From Chain",
          icon: "from-chain-icon",
          isUnsupportedNetwork: false,
        },
        toChain: {
          title: "To Chain",
          icon: "to-chain-icon",
          isUnsupportedNetwork: false,
        },
      },
      global: { plugins: [store] },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".select-title").text()).toBe("Select networks");
    expect(wrapper.find(".select-button-text").text()).toBe("From: From Chain");
  });

  it('emits changeNetwork event when "From" button is clicked', () => {
    const wrapper = shallowMount(ChainsWrap, {
      propsData: {
        selectChain: true,
        fromChain: {
          title: "From Chain",
          icon: "from-chain-icon",
          isUnsupportedNetwork: false,
        },
        toChain: {
          title: "To Chain",
          icon: "to-chain-icon",
          isUnsupportedNetwork: false,
        },
      },
      global: { plugins: [store] },
    });

    wrapper.find(".select-item").trigger("click");
    expect(wrapper.emitted("changeNetwork")).toBeTruthy();
    expect(wrapper.emitted("changeNetwork")![0][0]).toBe("from");
  });

  it('emits switch-chain event when "Switch" button is clicked', () => {
    const wrapper = shallowMount(ChainsWrap, {
      propsData: {
        selectChain: true,
        fromChain: {
          title: "From Chain",
          icon: "from-chain-icon",
          isUnsupportedNetwork: false,
        },
        toChain: {
          title: "To Chain",
          icon: "to-chain-icon",
          isUnsupportedNetwork: false,
        },
      },
      global: { plugins: [store] },
    });

    wrapper.find(".switch-chain-button").trigger("click");
    expect(wrapper.emitted("switch-chain")).toBeTruthy();
  });

  it('emits changeNetwork event when "To" button is clicked', () => {
    const wrapper = shallowMount(ChainsWrap, {
      propsData: {
        selectChain: true,
        fromChain: {
          title: "From Chain",
          icon: "from-chain-icon",
          isUnsupportedNetwork: false,
        },
        toChain: {
          title: "To Chain",
          icon: "to-chain-icon",
          isUnsupportedNetwork: false,
        },
      },
      global: { plugins: [store] },
    });

    wrapper.findAll(".select-item")[1].trigger("click");
    expect(wrapper.emitted("changeNetwork")).toBeTruthy();
    expect(wrapper.emitted("changeNetwork")![0][0]).toBe("to");
  });
});
