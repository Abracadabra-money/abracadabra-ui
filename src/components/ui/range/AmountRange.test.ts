import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import AmountRange from "@/components/ui/range/AmountRange.vue";

describe("AmountRange", () => {
  it("renders the component", () => {
    const wrapper = shallowMount(AmountRange);
    expect(wrapper.exists()).toBe(true);
  });

  it("emits the updateAmount event when the range input is changed", async () => {
    const wrapper = shallowMount(AmountRange);
    const rangeInput = wrapper.find('input[type="range"]');

    rangeInput.setValue(50);
    await rangeInput.trigger("input");

    expect(wrapper.emitted("updateAmount")).toBeTruthy();
  });
});
