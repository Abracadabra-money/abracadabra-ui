import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import PopupSearch from "@/components/popups/ui/PopupSearch.vue";

describe("PopupEmptyState.vue", () => {
  it("Should display the search input", () => {
    const wrapper = mount(PopupSearch);
    const input = wrapper.find(".search-input");
    expect(input.attributes().placeholder).toContain("Search");
  });
});
