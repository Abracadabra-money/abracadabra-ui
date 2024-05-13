import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import CauldronIcon from "@/components/ui/icons/CauldronIcon.vue";

describe("CauldronIcon", () => {
  it("renders with default width and height", () => {
    const wrapper = shallowMount(CauldronIcon);
    expect(wrapper.props().width).toBe(25);
    expect(wrapper.props().height).toBe(25);
  });

  it("renders with custom width and height", () => {
    const width = 30;
    const height = 30;
    const wrapper = shallowMount(CauldronIcon, {
      propsData: {
        width,
        height,
      },
    });
    expect(wrapper.props().width).toBe(width);
    expect(wrapper.props().height).toBe(height);
  });
});
