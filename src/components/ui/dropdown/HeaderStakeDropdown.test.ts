import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import HeaderStakeDropdown from "@/components/ui/dropdown/HeaderStakeDropdown.vue";

const clickOutside = vi.fn();

describe("HeaderStakeDropdown", () => {
  it("renders correctly when showDropdownList is false", () => {
    const wrapper = shallowMount(HeaderStakeDropdown, {
      directives: { clickOutside },
      data() {
        return {
          showDropdownList: false,
        };
      },
    });

    expect(wrapper.find(".dropdown-tools").classes()).not.toContain("active");
    expect(wrapper.find(".arrow").attributes("src")).toBe(
      "/src/assets/images/arrow-down.svg"
    );
    expect(wrapper.find(".list").exists()).toBe(false);
  });

  it("renders correctly when showDropdownList is true", () => {
    const wrapper = shallowMount(HeaderStakeDropdown, {
      directives: { clickOutside },
      data() {
        return {
          showDropdownList: true,
        };
      },
    });

    expect(wrapper.find(".dropdown-tools").classes()).toContain("active");
    expect(wrapper.find(".arrow").attributes("src")).toBe(
      "/src/assets/images/arrow-down.svg"
    );
    expect(wrapper.find(".list").exists()).toBe(true);
  });

  it("toggles the dropdown when clicked", async () => {
    const wrapper = shallowMount(HeaderStakeDropdown, {
      directives: { clickOutside },
    });

    expect(wrapper.vm.showDropdownList).toBe(false);

    await wrapper.find(".dropdown-tools").trigger("click");

    expect(wrapper.vm.showDropdownList).toBe(true);

    await wrapper.find(".dropdown-tools").trigger("click");

    expect(wrapper.vm.showDropdownList).toBe(false);
  });

  it("closes the dropdown when clicked outside", async () => {
    const wrapper = shallowMount(HeaderStakeDropdown, {
      directives: { clickOutside },
      data() {
        return {
          showDropdownList: true,
        };
      },
    });

    expect(wrapper.vm.showDropdownList).toBe(true);

    await wrapper.find(".list-link").trigger("click");

    expect(wrapper.vm.showDropdownList).toBe(false);
  });
});
