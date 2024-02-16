import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import QuestionMarkIcon from "@/components/ui/icons/QuestionMarkIcon.vue";

describe("QuestionMarkIcon", () => {
  it("renders with default props", () => {
    const wrapper = shallowMount(QuestionMarkIcon);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders with custom props", () => {
    const width = 20;
    const height = 25;
    const wrapper = shallowMount(QuestionMarkIcon, {
      propsData: {
        width,
        height,
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
