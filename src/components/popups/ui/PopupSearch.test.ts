import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import PopupSearch from "@/components/popups/ui/PopupSearch.vue";

describe("PopupSearch", () => {
  it("renders correctly", () => {
    const wrapper = shallowMount(PopupSearch);
    const input = wrapper.find(".search-input");

    expect(input.exists()).toBe(true);
  });

  it("renders the correct type", () => {
    const wrapper = shallowMount(PopupSearch);
    const input = wrapper.find(".search-input");

    expect(input.classes()).toContain("search-input");
    expect(input.attributes("type")).toBe("text");
  });

  it("renders the correct placeholder", () => {
    const wrapper = shallowMount(PopupSearch);
    const input = wrapper.find(".search-input");

    expect(input.attributes().placeholder).toBe("Search");
  });
});
