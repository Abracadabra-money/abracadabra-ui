import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import ClockIcon from "@/components/ui/icons/ClockIcon.vue";

describe("ClockIcon", () => {
  it("renders with default props", () => {
    const wrapper = shallowMount(ClockIcon);

    expect(wrapper.props().width).toBe(16);
    expect(wrapper.props().height).toBe(16);
    expect(wrapper.props().fill).toBe("#fff");
  });

  it("renders with custom props", () => {
    const width = 24;
    const height = 24;
    const fill = "#000";

    const wrapper = shallowMount(ClockIcon, {
      propsData: {
        width,
        height,
        fill,
      },
    });

    expect(wrapper.props().width).toBe(width);
    expect(wrapper.props().height).toBe(height);
    expect(wrapper.props().fill).toBe(fill);
  });
});
