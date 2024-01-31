import { shallowMount } from "@vue/test-utils";
import Networks from "@/components/ui/dropdown/Netwoks.vue";
import { describe, it, expect, vi } from "vitest";

const clickOutside = vi.fn();

describe("Networks", () => {
  it("toggles the dropdown when the header button is clicked", () => {
    const wrapper = shallowMount(Networks, { directives: { clickOutside } });
    const headerButton = wrapper.find(".dropdown-header");

    headerButton.trigger("click");

    expect(wrapper.vm.isOpenDropdown).toBe(true);
  });

  it("closes the dropdown when the closeDropdown method is called", () => {
    const wrapper = shallowMount(Networks, { directives: { clickOutside } });
    wrapper.setData({ isOpenDropdown: true });

    wrapper.vm.closeDropdown();

    expect(wrapper.vm.isOpenDropdown).toBe(false);
  });

  it("changes the dropdown value and emits an event when a dropdown item is clicked", () => {
    const wrapper = shallowMount(Networks, { directives: { clickOutside } });
    const dropdownItem = wrapper.find(".dropdown-item");
    const chainId = 42161;

    dropdownItem.trigger("click");

    expect(wrapper.vm.isOpenDropdown).toBe(false);
    expect(wrapper.emitted("changeForkId")).toBeTruthy();
    expect(wrapper.emitted("changeForkId")?.[0]?.[0]).toBe(chainId);
    expect(wrapper.vm.activeChain.chainId).toBe(chainId);
  });
});
