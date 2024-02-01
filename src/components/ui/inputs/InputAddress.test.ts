import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import InputAddress from "@/components/ui/inputs/InputAddress.vue";

describe("InputAddress", () => {
  it("renders input field with correct props", () => {
    const wrapper = shallowMount(InputAddress, {
      propsData: {
        destinationAddress: "0x1234567890",
        isDisabled: true,
        placeholder: "Add destination address",
        validation: true,
      },
    });

    const input = wrapper.find("input");
    expect(input.exists()).toBe(true);
    expect(input.classes()).toContain("input-address");
    expect(input.classes()).toContain("disabled");
    expect(input.attributes("placeholder")).toBe("Add destination address");
  });

  it("emits update-input event when input is valid", () => {
    const wrapper = shallowMount(InputAddress);

    const input = wrapper.find(".input-address");

    input.setValue("0x1234567890");
    input.trigger("input");

    expect(wrapper.emitted("input")).toBeTruthy();
  });

  it("emits error-input event when input is invalid", () => {
    const wrapper = shallowMount(InputAddress);

    const input = wrapper.find("input");
    input.setValue("invalid_address");
    input.trigger("input");

    const emittedEvent = wrapper.emitted("error-input");
    expect(emittedEvent).toBeTruthy();
    expect(emittedEvent?.[0]).toEqual([true]);
  });
});
