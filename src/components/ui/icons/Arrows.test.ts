import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import Arrows from "@/components/ui/icons/Arrows.vue";

describe("Arrows", () => {
  it("renders correctly", () => {
    const wrapper = shallowMount(Arrows, {
      propsData: {
        sortOrder: null,
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('sets the active class when sortOrder is "up"', () => {
    const wrapper = shallowMount(Arrows, {
      propsData: {
        sortOrder: "up" as any,
      },
    });

    expect(wrapper.find(".arrow-up").classes()).toContain("active");
    expect(wrapper.find(".arrow-down").classes()).not.toContain("active");
  });

  it('sets the active class when sortOrder is "down"', () => {
    const wrapper = shallowMount(Arrows, {
      propsData: {
        sortOrder: "down" as any,
      },
    });

    expect(wrapper.find(".arrow-up").classes()).not.toContain("active");
    expect(wrapper.find(".arrow-down").classes()).toContain("active");
  });
});
