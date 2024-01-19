import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import PopupEmptyState from "@/components/popups/ui/PopupEmptyState.vue";

describe("PopupEmptyState", () => {
  it("renders the correct empty state message when emptyType is provided", () => {
    const emptyType = "pools";
    const popupType = "example";

    const wrapper = shallowMount(PopupEmptyState, {
      propsData: {
        emptyType,
        popupType,
      },
    });

    const notFoundText = wrapper.find(".not-found__text");

    expect(notFoundText.text()).toBe(`No ${popupType} on this network`);
  });

  it("renders the correct empty state message when emptyType is not provided", () => {
    const popupType = "example";
    const emptyType = "example";

    const wrapper = shallowMount(PopupEmptyState, {
      propsData: {
        popupType,
        emptyType,
      },
    });

    console.log("notFoundText", wrapper.findAll(".not-found__text"));

    const notFoundText = wrapper.findAll(".not-found__text");
    expect(notFoundText[0].text()).toBe(`No ${popupType} found with this name`);
  });

  it('renders the correct empty state message when emptyType is "pools"', () => {
    const emptyType = "pools";
    const popupType = "example";

    const wrapper = shallowMount(PopupEmptyState, {
      propsData: {
        emptyType,
        popupType,
      },
    });

    const notFoundText = wrapper.find(".not-found__text");
    expect(notFoundText.text()).toBe(`No ${popupType} on this network`);
  });
});
