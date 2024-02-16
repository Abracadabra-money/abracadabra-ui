import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import ChartIcon from "@/components/ui/icons/ChartIcon.vue";

describe("ChartIcon", () => {
  it("renders correctly with default props", () => {
    const wrapper = shallowMount(ChartIcon);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders correctly with custom props", () => {
    const wrapper = shallowMount(ChartIcon, {
      propsData: {
        width: 32,
        height: 32,
        fill: "#FF0000",
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
