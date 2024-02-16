import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import ExpectedBlock from "@/components/beam/ExpectedBlock.vue";

describe("ExpectedBlock", () => {
  it("renders the estimated gas cost", () => {
    const data = {
      gasCost: 10,
      srcTokenPrice: 1.5,
    };
    const wrapper = shallowMount(ExpectedBlock, {
      propsData: { data },
    });

    const estimatedGasCost = wrapper.find(".usd").text();
    expect(estimatedGasCost).toContain("$ 15");
  });

  it("renders the gas on destination", () => {
    const data = {
      dstTokenAmount: 5,
      dstTokenPrice: 2.5,
    };
    const wrapper = shallowMount(ExpectedBlock, {
      propsData: { data },
    });

    const gasOnDestination = wrapper.findAll(".usd")[1].text();
    expect(gasOnDestination).toContain("$ 12.5");
  });
});
