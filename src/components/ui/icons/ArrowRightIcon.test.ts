import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import ArrowRightIcon from "@/components/ui/icons/ArrowRightIcon.vue";

describe("ArrowRightIcon", () => {
  it("renders with default props", () => {
    const wrapper = shallowMount(ArrowRightIcon);

    expect(wrapper.props().width).toBe(8);
    expect(wrapper.props().height).toBe(13);
    expect(wrapper.props().fill).toBe("#787A9B");
  });

  it("renders with custom props", () => {
    const width = 10;
    const height = 15;
    const fill = "#FF0000";

    const wrapper = shallowMount(ArrowRightIcon, {
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
