import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import BasketIcon from "@/components/ui/icons/BasketIcon.vue";

describe("BasketIcon", () => {
  it("renders correctly with default props", () => {
    const wrapper = shallowMount(BasketIcon);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders correctly with custom props", () => {
    const wrapper = shallowMount(BasketIcon, {
      propsData: {
        width: 24,
        height: 24,
        stroke: "#ff0000",
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
