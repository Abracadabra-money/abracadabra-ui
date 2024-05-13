import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import ArrowDownIcon from "@/components/ui/icons/ArrowDownIcon.vue";

describe("ArrowDownIcon", () => {
  it("renders correctly with default props", () => {
    const wrapper = shallowMount(ArrowDownIcon);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders correctly with custom props", () => {
    const wrapper = shallowMount(ArrowDownIcon, {
      propsData: {
        width: 30,
        height: 30,
        fill: "red",
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
