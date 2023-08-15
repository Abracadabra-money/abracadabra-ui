import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import BentoBoxItem from "@/components/myPositions/BentoBoxItem.vue";
import { ethers } from "ethers";
import filters from "@/filters/index.js";

describe("BentoBoxItem.vue", () => {
  const bentoLink = `https://abracadabramoney.gitbook.io/intro/the-dashboard#mim-balance-on-bentobox`;
  const degenLink = `https://abracadabramoney.gitbook.io/our-ecosystem/our-contracts#our-degenbox-contracts`;

  const testBalance = ethers.utils.parseUnits("20000000000000000", 3);

  it("Should return bentoLink if isBento", () => {
    const wrapper = mount(BentoBoxItem, {
      props: { isBento: true, balance: testBalance, mimPrice: 0 },
    });
    expect(wrapper.vm.link).toEqual(bentoLink);
  });

  it("Should degenLink if !isBento", () => {
    const wrapper = mount(BentoBoxItem, {
      props: { isBento: false, balance: testBalance, mimPrice: 0 },
    });
    expect(wrapper.vm.link).toEqual(degenLink);
  });

  it("Should calculate usdPrice correct", () => {
    const wrapper = mount(BentoBoxItem, {
      props: {
        isBento: true,
        balance: testBalance,
        mimPrice: 0.95,
      },
    });

    const balanceInUsd = filters.formatUSD(wrapper.vm.balanceInUsd);

    expect(balanceInUsd).toEqual("$ 19");
  });
});
