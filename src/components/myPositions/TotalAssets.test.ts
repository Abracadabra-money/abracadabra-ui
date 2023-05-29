import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import TotalAssets from "@/components/myPositions/TotalAssets.vue";

import filters from "@/filters/index.js";

const assetsDataTest = [
  {
    title: "Collateral Deposit",
    value: filters.formatUSD(1000),
  },
  {
    title: "MIM Borrowed",
    value: filters.formatTokenBalance(1000),
  },
  {
    title: "SPELL Farmed",
    value: filters.formatTokenBalance(1000),
    routName: "Farm",
    hidden: false,
  },
];

describe("TotalAssets.vue", () => {
  it("should render with routerLink if has routName", () => {
    const wrapper = mount(TotalAssets, {
      props: { assets: assetsDataTest },
    });

    const title = wrapper?.findAll("p.title").at(2)!;
    const value = wrapper.findAll("p.value").at(2)!;
    expect(title.text()).toBe("SPELL Farmed");
    expect(value.text()).toBe("1000.0");
  });

  it("should render without routerLink if has routName", () => {
    const wrapper = mount(TotalAssets, {
      props: { assets: assetsDataTest },
    });

    const title = wrapper?.findAll("p.title").at(0)!;
    const value = wrapper.findAll("p.value").at(0)!;
    expect(title.text()).toBe("Collateral Deposit");
    expect(value.text()).toBe("$ 1,000");
  });
});
