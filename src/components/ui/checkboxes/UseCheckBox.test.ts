import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import UseCheckbox from "@/components/ui/checkboxes/UseCheckbox.vue";
import ethConfig from "@/utils/cauldronsConfig/ethereumCauldrons";
import { useImage } from "@/helpers/useImage";

const ethStore = new Vuex.Store({
  modules: {
    connectProvider: {
      state: { chainId: 1 },
      getters: {
        getChainId: (state) => state.chainId,
      },
    },
  },
});

describe("UseCheckbox.vue", async () => {
  it("Should render if config has wrapInfo and calculate computed properties correct", () => {
    const wrapper: any = mount(UseCheckbox, {
      props: { config: ethConfig[30] },
      global: { plugins: [ethStore] },
    });

    const checkbox = wrapper.find(".checkbox");
    expect(checkbox.exists()).toBe(true);

    expect(wrapper.vm.isVisibility).toBe(true);
    expect(wrapper.vm.checkboxIcon).toBe(
      useImage("assets/images/checkbox/default.svg")
    );
    expect(wrapper.vm.tokenSymbol).toBe("magicAPE");
  });

  it("Should render if config has acceptUseDefaultBalance and calculate computed properties correct", () => {
    const wrapper: any = mount(UseCheckbox, {
      props: { config: ethConfig[18] },
      global: { plugins: [ethStore] },
    });

    expect(wrapper.vm.isVisibility).toBe(true);
    expect(wrapper.vm.checkboxIcon).toBe(
      useImage("assets/images/checkbox/default.svg")
    );
    expect(wrapper.vm.tokenSymbol).toBe("ETH");
  });

  it("Should not render if config has not acceptUseDefaultBalance or wrapInfo", () => {
    const wrapper: any = mount(UseCheckbox, {
      props: { config: ethConfig[17] },
      global: { plugins: [ethStore] },
    });

    const checkbox = wrapper.find(".checkbox");
    expect(checkbox.exists()).toBe(false);

    expect(wrapper.vm.isVisibility).toBe(false);
    expect(wrapper.vm.checkboxIcon).toBe(
      useImage("assets/images/checkbox/default.svg")
    );
    expect(wrapper.vm.tokenSymbol).toBe("UST");
  });

  it("Should call actionHandler on click", async () => {
    const wrapper: any = mount(UseCheckbox, {
      props: { config: ethConfig[30] },
      global: { plugins: [ethStore] },
    });

    const spy = vi.spyOn(wrapper.vm, "actionHandler");

    const checkbox = wrapper.find(".checkbox");
    expect(checkbox.classes()).not.toContain("active");
    checkbox.trigger("click");
    expect(spy).toHaveBeenCalled();
    await wrapper.setData({ active: true });
    expect(checkbox.classes()).toContain("active");
    expect(wrapper.vm.checkboxIcon).toBe(
      useImage("assets/images/checkbox/active.svg")
    );
  });
});
