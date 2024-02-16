import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import IconButton from "@/components/ui/buttons/IconButton.vue";

describe("IconButton", () => {
  it("renders the component correctly", () => {
    const wrapper = shallowMount(IconButton);
    expect(wrapper.exists()).toBe(true);
  });
});
