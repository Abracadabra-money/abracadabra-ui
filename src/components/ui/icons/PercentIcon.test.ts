import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import PercentIcon from "@/components/ui/icons/PercentIcon.vue";

describe("PercentIcon", () => {
  it("renders correctly with default props", () => {
    const wrapper = shallowMount(PercentIcon);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders correctly with custom props", () => {
    const width = 30;
    const height = 30;
    const wrapper = shallowMount(PercentIcon, {
      propsData: {
        width,
        height,
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
