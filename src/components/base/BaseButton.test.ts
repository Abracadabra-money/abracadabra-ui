import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import BaseButton from "@/components/base/BaseButton.vue";

describe("BaseButton", () => {
  it("renders slot content", () => {
    const wrapper = shallowMount(BaseButton, {
      slots: {
        default: "Button Text",
      },
    });

    expect(wrapper.text()).toContain("Button Text");
  });

  it("sets width to 100% if no width prop is provided", () => {
    const wrapper = shallowMount(BaseButton);

    expect(wrapper.attributes("style")).toContain("max-width: 100%");
  });

  it("sets width to the provided value", () => {
    const wrapper = shallowMount(BaseButton, {
      propsData: {
        width: "200px",
      },
    });

    expect(wrapper.attributes("style")).toContain("max-width: 200px");
  });

  it("applies primary class when primary prop is true", () => {
    const wrapper = shallowMount(BaseButton, {
      propsData: {
        primary: true,
      },
    });

    expect(wrapper.classes()).toContain("primary");
  });

  it("applies disabled class when disabled prop is true", () => {
    const wrapper = shallowMount(BaseButton, {
      propsData: {
        disabled: true,
      },
    });

    expect(wrapper.classes()).toContain("disabled");
  });

  it("applies borderless class when borderless prop is true", () => {
    const wrapper = shallowMount(BaseButton, {
      propsData: {
        borderless: true,
      },
    });

    expect(wrapper.classes()).toContain("borderless");
  });

  it("applies loader class when loading prop is true", () => {
    const wrapper = shallowMount(BaseButton, {
      propsData: {
        loading: true,
      },
    });

    expect(wrapper.find(".loader").exists()).toBe(true);
  });
});
