import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import GlpChartBlock from "@/components/stake/GlpChartBlock.vue";

describe("GlpChartBlock.vue", async () => {
  it("Should render loader", async () => {
    const props = { chainId: 1, apy: "", feePercent: 0 };

    const wrapper = mount(GlpChartBlock, { props });

    expect(wrapper.find(".loader-wrap").exists()).toBe(true);
    expect(wrapper.find(".chart-block").exists()).toBe(false);
  });
});
