import Vuex from "vuex";
import { providers } from "ethers";
import { defaultRpc } from "@/helpers/chains";
import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import ApprovalsPopup from "@/components/popups/ApprovalsPopup.vue";

const store = new Vuex.Store({
  modules: {
    connectProvider: {
      state: {
        chainId: 1,
        account: "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
      },
      getters: {
        getChainId: (state) => state.chainId,
        getAccount: (state) => state.account,
        getSigner: () => new providers.StaticJsonRpcProvider(defaultRpc[1]),
      },
    },
  },
});

const clickOutside = vi.fn();

describe("ApprovalsPopup", () => {
  it("renders the title correctly", () => {
    const wrapper = shallowMount(ApprovalsPopup, {
      global: { plugins: [store] },
      directives: { clickOutside },
    });
    const title = wrapper.find(".title");
    expect(title.text()).toBe("Attention");
  });

  it("calls closePopup method when close button is clicked", () => {
    const wrapper = shallowMount(ApprovalsPopup, {
      global: { plugins: [store] },
      directives: { clickOutside },
    });
    const closeButton = wrapper.find(".close");
    const closePopupMock = vi.fn();
    wrapper.vm.closePopup = closePopupMock;
    closeButton.trigger("click");
    expect(closePopupMock).toHaveBeenCalled();
  });
});
