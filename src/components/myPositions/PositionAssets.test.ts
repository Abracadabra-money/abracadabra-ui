import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import PositionAssets from "@/components/myPositions/PositionAssets.vue";

import { ethers } from "ethers";
import filters from "@/filters/index.js";
import mimIcon from "@/assets/images/tokens/MIM.png";
import spellIcon from "@/assets/images/tokens/SPELL.png";

const assetsInfoTest = [
  {
    title: "Collateral Deposited",
    symbol: "SPELL",
    icon: spellIcon,
    amount: filters.formatTokenBalance(1000000000000000000),
    amountUsd: filters.formatUSD(1000000000000000),
  },
  {
    title: "Borrowed",
    symbol: "MIM",
    icon: mimIcon,
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

  it("renders 2 assetsItems", () => {
    const wrapper = mount(PositionAssets, {
      props: { assetsInfo: assetsInfoTest },
    });

    const assetsItems = wrapper.findAll(".assets-item").at(0);
    expect(assetsItems.classes()).toContain("assets-item");
  });
});
