import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import PositionAssets from "@/components/myPositions/PositionAssets.vue";

import filters from "@/filters/index.js";

const assetsInfoTest = [
  {
    title: "Collateral Deposited",
    symbol: "SPELL",
    icon: "@/assets/images/tokens/SPELL.png",
    amount: filters.formatTokenBalance(1000000000000000000),
    amountUsd: filters.formatUSD(1000000000000000),
  },
  {
    title: "Borrowed",
    symbol: "MIM",
    icon: "@/assets/images/tokens/MIM.png",
    amount: filters.formatTokenBalance(10000000000000000000),
  },
];

describe("PositionAssets.vue", () => {
  it("renders", () => {
    const wrapper = mount(PositionAssets, {
      props: { assetsInfo: assetsInfoTest },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders assetsItems", () => {
    const wrapper = mount(PositionAssets, {
      props: { assetsInfo: assetsInfoTest },
    });

    const assetsItems = wrapper.findAll(".assets-item").at(0)!;
    expect(assetsItems.classes()).toContain("assets-item");
  });
});
