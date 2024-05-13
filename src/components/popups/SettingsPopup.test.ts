import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import SettingsPopup from "@/components/popups/SettingsPopup.vue";

const tooltip = vi.fn();

describe("SettingsPopup", () => {
  it("renders the title and subtitle correctly", () => {
    const config = {
      title: "Test Title",
      subtitle: "Test Subtitle",
    };
    const wrapper = shallowMount(SettingsPopup, {
      propsData: {
        config,
      },
      global: { directives: { tooltip } },
    });

    expect(wrapper.find(".title").text()).toBe(config.title);
    expect(wrapper.find(".subtitle").text()).toBe(config.subtitle);
  });

  it("emits the correct event when actionHandler is called", () => {
    const inputValue = 10;
    const config = {
      title: "Test Title",
      subtitle: "Test Subtitle",
    };
    const wrapper = shallowMount(SettingsPopup, {
      propsData: {
        config,
      },
      global: { directives: { tooltip } },
    });
    wrapper.setData({ inputValue });

    wrapper.vm.actionHandler();
    wrapper.vm.$emit("changeSettings");

    expect(wrapper.emitted("changeSettings")).toBeTruthy();
    expect(wrapper.emitted("changeSettings")![0][0]).toBe(inputValue);
  });
});
