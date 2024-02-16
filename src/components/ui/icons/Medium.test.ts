import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import MediumIcon from "@/components/ui/icons/Medium.vue";

describe("MediumIcon", () => {
  it("renders correctly", () => {
    const wrapper = shallowMount(MediumIcon);
    expect(wrapper.exists()).toBe(true);
  });
});
