import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Tooltip from "@/components/ui/icons/Tooltip.vue";

const tooltip = vi.fn();

describe("Tooltip.vue", () => {
  const wrapper = mount(Tooltip, { directives: { tooltip } });
  it("Should render correct without props", () => {
    const tooltipImg = wrapper.find(".tooltip");
    expect(tooltipImg.exists()).toBe(true);
    expect(wrapper.props().tooltip).toBe("");
  });

  it("Should render correct with props", async () => {
    await wrapper.setProps({ tooltip: "test tooltip text" });
    expect(wrapper.props().tooltip).toBe("test tooltip text");
  });
});
