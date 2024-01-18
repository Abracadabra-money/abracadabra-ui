import Vuex from "vuex";
import { ethers } from "ethers";
import { chains } from "@/helpers/chains";
import { describe, it, expect, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import AppHeader from "@/components/app/AppHeader.vue";

const store = new Vuex.Store({
  modules: {
    connectProvider: {
      state: {
        chainId: 1,
        account: ethers.Wallet.createRandom(),
        networks: chains,
      },
      getters: {
        getChainId: (state) => state.chainId,
        getAccount: (state) => state.account,
        getAvailableNetworks: (state) => state.networks,
      },
    },
  },
});

const tooltip = vi.fn();

describe("AppHeader", () => {
  it("renders correctly", () => {
    const wrapper = shallowMount(AppHeader, {
      global: { plugins: [store] },
      directives: { tooltip },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("toggles mobile menu when burger icon is clicked", () => {
    const wrapper = shallowMount(AppHeader, {
      global: { plugins: [store] },
      directives: { tooltip },
    });
    const burger = wrapper.find(".burger");
    burger.trigger("click");
    expect(wrapper.vm.mobileMenu).toBe(true);
  });

  it("opens network popup when networks button is clicked", () => {
    const wrapper = shallowMount(AppHeader, {
      global: { plugins: [store] },
      directives: { tooltip },
    });
    const networksBtn = wrapper.find(".networks-btn");
    networksBtn.trigger("click");
    expect(wrapper.vm.isOpenNetworkPopup).toBe(true);
  });

  it("closes network popup when closePopup event is emitted", () => {
    const wrapper = shallowMount(AppHeader, {
      global: { plugins: [store] },
      directives: { tooltip },
    });
    wrapper.setData({ isOpenNetworkPopup: true });
    wrapper.vm.closeNetworkPopup();
    expect(wrapper.vm.isOpenNetworkPopup).toBe(false);
  });

  it("changes mobileMenu to false when closePopup event is emitted", () => {
    const wrapper = shallowMount(AppHeader, {
      global: { plugins: [store] },
      directives: { tooltip },
    });
    wrapper.setData({ mobileMenu: true });
    wrapper.vm.closeMobilePopup();
    expect(wrapper.vm.mobileMenu).toBe(false);
  });

  it("changes mobileMenu to false when closePopup event is emitted", () => {
    const wrapper = shallowMount(AppHeader, {
      global: { plugins: [store] },
      directives: { tooltip },
    });
    wrapper.setData({ mobileMenu: true });
    wrapper.vm.closeMobilePopup();
    expect(wrapper.vm.mobileMenu).toBe(false);
  });
});
