import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import LocalPopupWrap from "@/components/popups/LocalPopupWrap.vue";

describe("LocalPopupWrap", () => {
  it("renders when isOpened is true", () => {
    const wrapper = shallowMount(LocalPopupWrap, {
      propsData: {
        isOpened: true,
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("emits closePopup event when close button is clicked", () => {
    const wrapper = shallowMount(LocalPopupWrap, {
      propsData: {
        isOpened: true,
      },
    });

    wrapper.find(".close-btn").trigger("click");

    expect(wrapper.emitted("closePopup")).toBeTruthy();
  });
});
