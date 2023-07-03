import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import PopupEmptyState from "@/components/popups/ui/PopupEmptyState.vue";

describe("PopupEmptyState.vue", () => {
  it("Should return empty state for borrow", () => {
    const wrapper = mount(PopupEmptyState, {
      propsData: {
        emptyType: "pools",
        popupType: "borrow",
      },
    });

    const text = wrapper.find(".not-found__text");
    expect(text.text()).toContain("No borrow on this network");
  });

  it("Should return  empty state to search the borrow", () => {
    const wrapper = mount(PopupEmptyState, {
      propsData: {
        emptyType: "search",
        popupType: "borrow",
      },
    });

    const text = wrapper.find(".not-found__text");
    expect(text.text()).toContain("No borrow found with this name");
  });

  it("Should return empty state for farm", () => {
    const wrapper = mount(PopupEmptyState, {
      propsData: {
        emptyType: "pools",
        popupType: "farms",
      },
    });

    const text = wrapper.find(".not-found__text");
    expect(text.text()).toContain("No farms on this network");
  });

  it("Should return  empty state to search the farm", () => {
    const wrapper = mount(PopupEmptyState, {
      propsData: {
        emptyType: "search",
        popupType: "farms",
      },
    });

    const text = wrapper.find(".not-found__text");
    expect(text.text()).toContain("No farms found with this name");
  });
});
