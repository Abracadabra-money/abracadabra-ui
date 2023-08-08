import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Range from "@/components/ui/Range.vue";

const tooltip = vi.fn();

describe("Range.vue", () => {
  const wrapper = mount(Range, { directives: { tooltip } });

  it("Should render and calculate computed properties correct if props have not passed", () => {
    const range = wrapper.find('input[type="range"]');
    expect(range.exists()).toBe(true);
    expect(range.attributes()).toContain({
      class: "default",
      max: "10",
      min: "0",
      step: "1",
      type: "range",
    });

    expect(wrapper.find(".info-btn").exists()).toBe(false);
    expect(wrapper.find("h4").text()).toBe("Leverage up");
    expect(wrapper.find(".range-subtitle").text()).toBe("");
    expect(wrapper.find(".range-status").exists()).toBe(false);

    expect(wrapper.vm.gradientRangeTrack).toBe(`linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.3) 0%,
            rgba(255, 255, 255, 0.3) 0%,
            rgb(63,61,73) 0%,
            rgb(63,61,73) 100%
          )
          `);
    expect(wrapper.vm.gradientPercent).toBe(0);
    expect(wrapper.vm.range).toBe(0);
  });

  it("Should render with passed props", async () => {
    await wrapper.setProps({
      value: 10,
      collateralValue: 1,
      min: 5,
      max: 15,
      step: 2,
      risk: "safe",
      title: "Test title",
      tooltipText: "Test tooltip text",
      subtitle: "Test subtitle",
      disabled: false,
      parallelRange: 1,
    });

    const range = wrapper.find('input[type="range"]');
    expect(range.exists()).toBe(true);
    expect(range.attributes()).toContain({
      class: "safe",
      max: "15",
      min: "5",
      step: "2",
      type: "range",
    });

    expect(wrapper.find(".info-btn").exists()).toBe(true);
    expect(wrapper.find("h4").text()).toBe("Test title");
    expect(wrapper.find(".range-subtitle").text()).toBe("Test subtitle");
    expect(wrapper.find(".range-status").exists()).toBe(true);

    expect(wrapper.vm.gradientRangeTrack).toBe(`linear-gradient(
            90deg,
            #63CAF8 0%,
            #63CAF8 50%,
            rgb(63,61,73) 50%,
            rgb(63,61,73) 100%
          )
          `);
    expect(wrapper.vm.gradientPercent).toBe(50);
    expect(wrapper.vm.range).toBe(10);
  });

  it("Should emit value on changing", async () => {
    const range = wrapper.find('input[type="range"]');
    await range.setValue(12);
    expect(wrapper.emitted().updateValue[0]).toContainEqual("12");
    await wrapper.setProps({ value: 12 });
    expect(wrapper.vm.range).toBe(12);
  });

  it("Should calculate gradientPecrent properly on edge cases", async () => {
    await wrapper.setProps({ min: 1, value: 1 });
    expect(wrapper.vm.gradientPercent).toBe(0);

    await wrapper.setProps({ min: 1, value: 10, max: 10 });
    expect(wrapper.vm.gradientPercent).toBe(100);

    await wrapper.setProps({ min: 0, parallelRange: "0" });
    expect(wrapper.vm.gradientPercent).toBe(0);
  });
});
