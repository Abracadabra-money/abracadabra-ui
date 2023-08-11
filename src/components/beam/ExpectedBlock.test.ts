import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ExpectedBlock from "@/components/beam/ExpectedBlock.vue";

const data = {
  mimAmount: "10",
  dstTokenAmount: "18.47",
  dstTokenSymbol: "AVAX",
  gasCost: "0.17179882",
  srcTokenSymbol: "ETH",
};

describe("ExpectedBlock.vue", () => {
  it("Should render data", () => {
    const wrapper = mount(ExpectedBlock, {
      props: { data },
    });
    const values = wrapper.findAll(".value");
    expect(values[0].text()).toBe("10 MIM");
    expect(values[1].text()).toBe("18.47 AVAX");
    expect(values[2].text()).toBe("$ 1.00");
    expect(values[3].text()).toBe("0.17179882 ETH");
  });
});
