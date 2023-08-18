import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ApeChartBlock from "@/components/stake/ApeChartBlock.vue";

describe("ApeChartBlock.vue", async () => {
  it("Should render loader", async () => {
    const props = { apy: "" };

    const wrapper = mount(ApeChartBlock, { props });

    expect(wrapper.find(".loader-wrap").exists()).toBe(true);
    expect(wrapper.find(".chart-block").exists()).toBe(false);
  });
});
