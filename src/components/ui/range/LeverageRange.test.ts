import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import LeverageRange from "@/components/ui/range/LeverageRange.vue";

describe("LeverageRange", () => {
  it("renders the component correctly", () => {
    const wrapper = shallowMount(LeverageRange);
    expect(wrapper.exists()).toBe(true);
  });

  it("updates the range value correctly", () => {
    const wrapper = shallowMount(LeverageRange);
    const input = wrapper.find("input");

    input.setValue(5);

    console.log("wrapper.vm.inputValue", wrapper.vm.inputValue);

    expect(wrapper.vm.inputValue).toBe("5");

    input.setValue(10);
    expect(wrapper.vm.inputValue).toBe("10");
  });
});
