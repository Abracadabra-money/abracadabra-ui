import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import ExplorerLink from "@/components/beam/successPopup/ExplorerLink.vue";

describe("ExplorerLink", () => {
  it("renders link when link prop is provided", () => {
    const link = "https://example.com";
    const title = "Explorer";
    const wrapper = shallowMount(ExplorerLink, {
      propsData: {
        link,
        title,
      },
    });

    expect(wrapper.find(".wrapper").exists()).toBe(true);
    expect(wrapper.find(".link").exists()).toBe(true);
    expect(wrapper.find(".link").attributes("href")).toBe(link);
    expect(wrapper.find(".link").text()).toBe(title);
    expect(wrapper.find(".arrow").exists()).toBe(true);
    expect(wrapper.find(".loader-wrap").exists()).toBe(false);
  });

  it("renders loader when link prop is not provided", () => {
    const wrapper = shallowMount(ExplorerLink, {
      propsData: {
        link: false,
      },
    });

    expect(wrapper.find(".wrapper").exists()).toBe(false);
    expect(wrapper.find(".link").exists()).toBe(false);
    expect(wrapper.find(".arrow").exists()).toBe(false);
    expect(wrapper.find(".loader-wrap").exists()).toBe(true);
    expect(wrapper.findComponent({ name: "BaseLoader" }).exists()).toBe(true);
  });
});
