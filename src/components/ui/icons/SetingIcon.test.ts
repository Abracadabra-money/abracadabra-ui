import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import SetingIcon from "@/components/ui/icons/SetingIcon.vue";

describe("SetingIcon", () => {
  it("renders correctly with default props", () => {
    const wrapper = shallowMount(SetingIcon);
    expect(wrapper.props().width).toBe(18);
    expect(wrapper.props().height).toBe(18);
    expect(wrapper.props().fill).toBe("#7088CC");
  });

  it("renders correctly with custom props", () => {
    const wrapper = shallowMount(SetingIcon, {
      propsData: {
        width: 20,
        height: 20,
        fill: "red",
      },
    });
    expect(wrapper.props().width).toBe(20);
    expect(wrapper.props().height).toBe(20);
    expect(wrapper.props().fill).toBe("red");
  });
});
