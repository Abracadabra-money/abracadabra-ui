import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import SortButton from "@/components/ui/buttons/SortButton.vue";
import type { SortOrder } from "@/views/MyPositions.vue";

describe("SortButton", () => {
  it("renders the component correctly", () => {
    const wrapper = shallowMount(SortButton);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders the Arrows component", () => {
    const wrapper = shallowMount(SortButton);
    expect(wrapper.findComponent({ name: "Arrows" }).exists()).toBe(true);
  });

  it("sets the sortOrder prop correctly", () => {
    const sortOrder: SortOrder = "up";
    const wrapper: any = shallowMount(SortButton, {
      propsData: {
        sortOrder,
      },
    });
    expect(wrapper.props("sortOrder")).toBe(sortOrder);
  });
});
