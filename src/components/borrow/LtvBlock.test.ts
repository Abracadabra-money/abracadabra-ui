import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import LtvBlock from "@/components/borrow/LtvBlock.vue";
import Tooltip from "@/components/ui/icons/Tooltip.vue";

describe("LtvBlock.vue", async () => {
  const tooltip = vi.fn();

  const wrapper: any = mount(LtvBlock, {
    global: { directives: { tooltip } },
  });

  it("Should render without props", () => {
    const ltvBlock = wrapper.find(".ltv-block");
    const ltvItem = wrapper.findAll(".ltv-item");
    expect(ltvBlock.exists()).toBe(true);
    expect(ltvItem[1].text()).toBe("0%");
    expect(wrapper.vm.tooltip).toBe(
      "Loan to Value: percentage of debt compared to the collateral. The higher it is, the riskier the position"
    );
    expect(wrapper.findComponent(Tooltip)).toBeTruthy();
  });

  it("Should render with props passed", async () => {
    await wrapper.setProps({
      ltv: 10,
      tooltip: "Test tooltip text",
    });
    const ltvBlock = wrapper.find(".ltv-block");
    const ltvItem = wrapper.findAll(".ltv-item");
    expect(ltvBlock.exists()).toBe(true);
    expect(ltvItem[1].text()).toBe("10%");
    expect(wrapper.vm.tooltip).toBe("Test tooltip text");
  });
});
