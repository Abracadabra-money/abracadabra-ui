import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import InputAddress from "@/components/beam/InputAddress.vue";

describe("InputAddress", () => {
  it("renders input field with correct props", () => {
    const destinationAddress = "0x1234567890abcdef";
    const isDisabled = true;
    const placeholder = "Add destination address";
    const wrapper = shallowMount(InputAddress, {
      propsData: {
        destinationAddress,
        isDisabled,
        placeholder,
      },
    });

    const input = wrapper.find(".input-address");
    expect(input.exists()).toBe(true);
    expect(input.classes()).toContain("disabled");
    expect(input.attributes("placeholder")).toBe(placeholder);
    expect((input.element as HTMLInputElement).value).toBe(destinationAddress);
  });

  it("displays error message when addressEntryError is true", () => {
    const wrapper = shallowMount(InputAddress, {
      computed: {
        addressEntryError() {
          return true;
        },
      },
    });
    wrapper.setData({ address: "0x" });

    const errorMessage = wrapper.find(".error-message");
    expect(errorMessage.exists()).toBe(true);
    expect(errorMessage.classes()).toContain("visibility");
    expect(errorMessage.text()).toBe("Invalid address");
  });

  it("does not display error message when addressEntryError is false", () => {
    const wrapper = shallowMount(InputAddress);
    wrapper.setData({ address: "0x1234567890abcdef" });

    const errorMessage = wrapper.find(".error-message");
    expect(errorMessage.exists()).toBe(false);
  });
});
