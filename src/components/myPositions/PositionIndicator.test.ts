import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import PositionIndicator from "@/components/myPositions/PositionIndicator.vue";

describe("PositionIndicator", () => {
  it("renders the formatted value correctly", () => {
    const value = 1000;
    const wrapper = shallowMount(PositionIndicator, {
      propsData: { value },
    });

    expect(wrapper.find(".value").text()).toBe("$ 1,000");
  });

  it("sets the correct  tooltip color for safe position risk", () => {
    const wrapper = shallowMount(PositionIndicator, {
      propsData: { value: 10, positionRisk: "safe" },
    });

    expect(wrapper.vm.tooltipColor).toBe("#67A069");
  });

  it("sets the correct tooltip color for medium position risk", () => {
    const wrapper = shallowMount(PositionIndicator, {
      propsData: { value: 75, positionRisk: "medium" },
    });

    wrapper.setProps({ positionRisk: "medium" });
    expect(wrapper.vm.tooltipColor).toBe("#DDC237");
  });

  it("sets the correct tooltip color for high position risk", () => {
    const wrapper = shallowMount(PositionIndicator, {
      propsData: { value: 99, positionRisk: "high" },
    });

    wrapper.setProps({ positionRisk: "high" });
    expect(wrapper.vm.tooltipColor).toBe("#8C4040");
  });

  it("sets the correct tooltip color for unknown position risk", () => {
    const wrapper = shallowMount(PositionIndicator, {
      propsData: { value: 0, positionRisk: "" },
    });

    wrapper.setProps({ positionRisk: "unknown" });
    expect(wrapper.vm.tooltipColor).toBe("#fff");
  });
});
