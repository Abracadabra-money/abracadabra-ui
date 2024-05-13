import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import Toggle from "@/components/ui/Toggle.vue";

describe("Toggle", () => {
  it("renders correctly when selected is false", () => {
    const wrapper = shallowMount(Toggle, {
      propsData: {
        selected: false,
        text: "Toggle Text",
      },
    });

    expect(wrapper.find(".toggle").classes()).not.toContain("selected");
  });

  it("renders correctly when selected is true", () => {
    const wrapper = shallowMount(Toggle, {
      propsData: {
        selected: true,
        text: "Toggle Text",
      },
    });

    expect(wrapper.find(".toggle").classes()).toContain("selected");
  });

  it("emits updateToggle event when clicked", () => {
    const wrapper = shallowMount(Toggle, {
      propsData: {
        selected: false,
        text: "Toggle Text",
      },
    });

    wrapper.find(".toggle").trigger("click");

    expect(wrapper.emitted("updateToggle")).toBeTruthy();
  });
});
