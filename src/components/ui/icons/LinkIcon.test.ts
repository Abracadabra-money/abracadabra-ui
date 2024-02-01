import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import LinkIcon from "@/components/ui/icons/LinkIcon.vue";

describe("LinkIcon", () => {
  it("renders correctly with default props", () => {
    const wrapper = shallowMount(LinkIcon);
    expect(wrapper.props().width).toBe(18);
    expect(wrapper.props().height).toBe(18);
    expect(wrapper.props().fill).toBe("#7088CC");
  });

  it("renders correctly with custom props", () => {
    const width = 24;
    const height = 24;
    const fill = "#FF0000";
    const wrapper = shallowMount(LinkIcon, {
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
