import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import MiniStatusTag from "@/components/ui/MiniStatusTag.vue";

describe("MiniStatusTag", () => {
  it("renders the default text", () => {
    const wrapper = shallowMount(MiniStatusTag);
    expect(wrapper.find("p").text()).toBe("Migrated");
  });

  it("renders the provided text", () => {
    const text = "Custom Text";
    const wrapper = shallowMount(MiniStatusTag, {
      propsData: {
        text,
      },
    });
    expect(wrapper.find("p").text()).toBe(text);
  });

  it("has the rounded class when rounded prop is true", () => {
    const wrapper = shallowMount(MiniStatusTag, {
      propsData: {
        rounded: true,
      },
    });
    expect(wrapper.classes()).toContain("rounded");
  });

  it("does not have the rounded class when rounded prop is false", () => {
    const wrapper = shallowMount(MiniStatusTag, {
      propsData: {
        rounded: false,
      },
    });
    expect(wrapper.classes()).not.toContain("rounded");
  });
});
