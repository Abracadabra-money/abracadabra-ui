import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import ArrowTopRightIcon from "@/components/ui/icons/ArrowTopRightIcon.vue";

describe("ArrowTopRightIcon", () => {
  it("renders with default props", () => {
    const wrapper = shallowMount(ArrowTopRightIcon);

    expect(wrapper.props().width).toBe(8);
    expect(wrapper.props().height).toBe(8);
    expect(wrapper.props().fill).toBe("#7088CC");
  });

  it("renders with custom props", () => {
    const width = 10;
    const height = 10;
    const fill = "#FF0000";

    const wrapper = shallowMount(ArrowTopRightIcon, {
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
