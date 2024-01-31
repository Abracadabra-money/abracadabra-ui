import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import SuccessPopup from "@/components/popups/SuccessPopup.vue";

const clickOutside = vi.fn();

describe("SuccessPopup", () => {
  it("renders the component correctly", () => {
    const wrapper = shallowMount(SuccessPopup, {
      directives: { clickOutside },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
