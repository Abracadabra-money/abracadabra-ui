import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import BeamSettingsButton from "@/components/ui/buttons/BeamSettingsButton.vue";

describe("BeamSettingsButton", () => {
  it("renders button with default props", () => {
    const wrapper = shallowMount(BeamSettingsButton);
    expect(wrapper.find("button").exists()).toBe(true);
    expect(wrapper.find(".btn").exists()).toBe(true);
    expect(wrapper.find(".active").exists()).toBe(false);
    expect(wrapper.vm.buttonType).toBe("wallet");
  });

  it("renders button with active class when active prop is true", () => {
    const wrapper = shallowMount(BeamSettingsButton, {
      propsData: {
        active: true,
      },
    });
    expect(wrapper.find(".active").exists()).toBe(true);
  });

  it('renders button with settings icon when buttonType prop is "settings"', () => {
    const wrapper = shallowMount(BeamSettingsButton, {
      propsData: {
        buttonType: "settings",
      },
    });
    expect(wrapper.find('svg[width="24"]').exists()).toBe(true);
    expect(wrapper.find('svg[width="18"]').exists()).toBe(false);
  });

  it('renders button with wallet icon when buttonType prop is "wallet"', () => {
    const wrapper = shallowMount(BeamSettingsButton, {
      propsData: {
        buttonType: "wallet",
      },
    });
    expect(wrapper.find('svg[width="18"]').exists()).toBe(true);
    expect(wrapper.find('svg[width="24"]').exists()).toBe(false);
  });
});
