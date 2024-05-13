import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import SortButton from "@/components/ui/buttons/SortButton.vue";

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
    const sortOrder: string = "asc";
    const wrapper: any = shallowMount(SortButton, {
      propsData: {
        sortOrder,
      },
    });
    expect(wrapper.props("sortOrder")).toBe(sortOrder);
  });
});
