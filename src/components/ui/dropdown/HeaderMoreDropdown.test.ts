import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import HeaderMoreDropdown from "@/components/ui/dropdown/HeaderMoreDropdown.vue";

const clickOutside = vi.fn();

describe("HeaderMoreDropdown", () => {
  it("toggles dropdown list when clicked", () => {
    const wrapper = shallowMount(HeaderMoreDropdown, {
      directives: { clickOutside },
    });
    const dropdown = wrapper.find(".dropdown-tools");

    dropdown.trigger("click");
    expect(wrapper.vm.showDropdownList).toBe(true);

    dropdown.trigger("click");
    expect(wrapper.vm.showDropdownList).toBe(false);
  });

  it("closes dropdown list when clicked outside", () => {
    const wrapper = shallowMount(HeaderMoreDropdown, {
      directives: { clickOutside },
    });
    wrapper.setData({ showDropdownList: true });

    wrapper.vm.closeDropdown();
    expect(wrapper.vm.showDropdownList).toBe(false);
  });
});
