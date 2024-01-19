import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import NetworkPopup from "@/components/popups/NetworkPopup.vue";

describe("NetworkPopup", () => {
  it("renders when isOpen is true", () => {
    const wrapper = shallowMount(NetworkPopup, {
      propsData: {
        isOpen: true,
        networksArr: [],
        activeChain: "",
        popupType: "",
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("does not render when isOpen is false", () => {
    const wrapper = shallowMount(NetworkPopup, {
      propsData: {
        isOpen: false,
        networksArr: [],
        activeChain: "",
        popupType: "",
      },
    });

    expect(wrapper.isVisible()).toBe(false);
  });
});
