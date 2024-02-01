import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import TooltipIcon from "@/components/ui/icons/Tooltip.vue";

const tooltip = vi.fn();

describe("TooltipIcon", () => {
  it("renders correctly with default props", () => {
    const wrapper = shallowMount(TooltipIcon, { directives: { tooltip } });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.props().width).toBe(24);
    expect(wrapper.props().height).toBe(24);
    expect(wrapper.props().fill).toBe("#fff");
    expect(wrapper.props().tooltip).toBe("");
  });

  it("renders correctly with custom props", () => {
    const width = 32;
    const height = 32;
    const fill = "#000";
    const tooltip = "Tooltip text";

    const wrapper = shallowMount(TooltipIcon, {
      directives: { tooltip },
      propsData: {
        width,
        height,
        fill,
        tooltip,
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.props().width).toBe(width);
    expect(wrapper.props().height).toBe(height);
    expect(wrapper.props().fill).toBe(fill);
    expect(wrapper.props().tooltip).toBe(tooltip);
  });
});
