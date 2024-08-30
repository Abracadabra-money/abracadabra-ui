import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import CamelotUsdcMimCard from "@/components/cauldrons/promoCards/CamelotUsdcMimCard.vue";

describe("CamelotUsdcMimCard", () => {
  it("renders the component correctly", () => {
    const wrapper = shallowMount(CamelotUsdcMimCard);
    expect(wrapper.exists()).toBe(true);
  });

  it("formats large sum correctly", () => {
    const wrapper = shallowMount(CamelotUsdcMimCard);
    const formattedSum = wrapper.vm.formatLargeSum(1000000);
    expect(formattedSum).toBe("1M");
  });
});
