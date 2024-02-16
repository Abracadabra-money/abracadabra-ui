import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import ChainsDropdown from "@/components/ui/dropdown/ChainsDropdown.vue";

const clickOutside = vi.fn();

describe("ChainsDropdown", () => {
  it("renders correctly", () => {
    const wrapper = shallowMount(ChainsDropdown, {
      directives: { clickOutside },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
