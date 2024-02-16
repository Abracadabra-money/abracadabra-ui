import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import TimeFrame from "@/components/ui/buttons/TimeFrame.vue";

describe("TimeFrame", () => {
  it("renders the active frame label correctly", () => {
    const timesFrame = [
      { label: "Frame 1", time: 100 },
      { label: "Frame 2", time: 200 },
      { label: "Frame 3", time: 300 },
    ];
    const wrapper = shallowMount(TimeFrame, {
      propsData: {
        timesFrame,
      },
    });

    expect(wrapper.find(".value").text()).toBe(timesFrame[0].label);
  });

  it("emits the updated time frame on click", () => {
    const timesFrame = [
      { label: "Frame 1", time: 100 },
      { label: "Frame 2", time: 200 },
      { label: "Frame 3", time: 300 },
    ];
    const wrapper = shallowMount(TimeFrame, {
      propsData: {
        timesFrame,
      },
    });

    wrapper.find(".frame-btn").trigger("click");

    expect(wrapper.emitted("updateTimeFrame")).toBeTruthy();
    expect(wrapper.emitted("updateTimeFrame")?.[0]?.[0]).toBe(
      timesFrame[1].time
    );
  });
});
