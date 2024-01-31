import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import LtvRange from "@/components/ui/range/LtvRange.vue";

describe("LtvRange", () => {
  it("renders correctly", () => {
    const wrapper = shallowMount(LtvRange, {
      propsData: {
        risk: "safe",
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("updates the range value correctly", () => {
    const wrapper = shallowMount(LtvRange, {
      propsData: {
        risk: "safe",
      },
    });
    const input = wrapper.find("input");
    input.setValue(50);
    expect(wrapper.vm.inputValue).toBe("50");
  });

  it("emits the updated value on input", () => {
    const wrapper = shallowMount(LtvRange, {
      propsData: {
        risk: "safe",
      },
    });
    const input = wrapper.find("input");
    input.setValue(75);
    expect(wrapper.emitted("updateValue")).toBeTruthy();
  });
});
