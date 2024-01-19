import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import MobileMenu from "@/components/popups/MobileMenu.vue";

const tooltip = vi.fn();

describe("MobileMenu", () => {
  it("closes the popup when closePopup method is called", () => {
    const wrapper = shallowMount(MobileMenu, {
      global: { directives: { tooltip } },
    });
    wrapper.vm.closePopup();
    expect(wrapper.emitted("closePopup")).toBeTruthy();
  });

  it("opens the inner popup when openInnerPopup method is called", () => {
    const wrapper = shallowMount(MobileMenu, {
      global: { directives: { tooltip } },
    });
    wrapper.vm.openInnerPopup();
    expect(wrapper.vm.showStake).toBe(true);
  });

  it("closes the inner popup when closeInnerPopup method is called", () => {
    const wrapper = shallowMount(MobileMenu, {
      global: { directives: { tooltip } },
    });
    wrapper.setData({ showStake: true });
    wrapper.vm.closeInnerPopup();
    expect(wrapper.vm.showStake).toBe(false);
  });
});
