import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import SettingsButton from "@/components/ui/buttons/SettingsButton.vue";

describe("SettingsButton", () => {
  it("renders button with correct classes when active prop is false", () => {
    const wrapper = shallowMount(SettingsButton, {
      propsData: {
        active: true,
      },
    });

    expect(wrapper.find(".settings-btn").classes()).toContain("active");
  });

  it("renders button with correct classes when active prop is true", () => {
    const wrapper = shallowMount(SettingsButton, {
      propsData: {
        active: false,
      },
    });

    expect(wrapper.find(".settings-btn").classes()).not.toContain("active");
  });
});
