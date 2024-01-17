import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import CamelotUsdcMimCard from "@/components/cauldrons/CamelotUsdcMimCard.vue";

describe("CamelotUsdcMimCard", () => {
  it("renders the component correctly", () => {
    const wrapper = shallowMount(CamelotUsdcMimCard);
    expect(wrapper.exists()).toBe(true);
  });

  it("fetches data correctly", async () => {
    const wrapper = shallowMount(CamelotUsdcMimCard);
    await wrapper.vm.fetchData();
    expect(wrapper.vm.tvl).not.toBeNull();
    expect(wrapper.vm.aprRange).not.toBeNull();
  });

  it("formats large sum correctly", () => {
    const wrapper = shallowMount(CamelotUsdcMimCard);
    const formattedSum = wrapper.vm.formatLargeSum(1000000);
    expect(formattedSum).toBe("1M");
  });

  it("formats percent correctly", () => {
    const wrapper = shallowMount(CamelotUsdcMimCard);
    const formattedPercent = wrapper.vm.formatPercent(0.05);
    expect(formattedPercent).toBe("0.05%");
  });
});
