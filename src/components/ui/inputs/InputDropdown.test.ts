import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import InputDropdown from "@/components/ui/inputs/InputDropdown.vue";

const clickOutside = vi.fn();

describe("InputDropdown", () => {
  it("renders correctly", () => {
    const wrapper = shallowMount(InputDropdown, {
      directives: { clickOutside },
      propsData: {
        destinationAddress: "",
        isDisabled: false,
        placeholder: "Add destination address",
        dropdownList: [],
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("updates input value on input event", () => {
    const wrapper = shallowMount(InputDropdown, {
      directives: { clickOutside },
      propsData: {
        destinationAddress: "",
        isDisabled: false,
        placeholder: "Add destination address",
        dropdownList: [],
      },
    });

    const input = wrapper.find(".input-address");
    input.setValue("0x1234567890");

    expect(wrapper.vm.address).toBe("0x1234567890");
  });
});
