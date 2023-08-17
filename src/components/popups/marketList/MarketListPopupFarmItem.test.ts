import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import MarketsListPopupFarmItem from "@/components/popups/marketList/MarketsListPopupFarmItem.vue";
import config from "@/utils/cauldronsConfig/ethereumCauldrons";

const userInfoTest = {
  collateralAmount: 1000,
  collateralAmountUsd: 10000,
  unwrappedTokenAmount: 1000,
  unwrappedTokenAmountUsd: 10000,
};

const marketItemTest = {
  config: config[4],
  interest: 0.1,
  userInfo: userInfoTest,
  id: 1,
};

describe("MarketsListPopupFarmItem.vue", () => {
  const wrapper = mount(MarketsListPopupFarmItem, {
    props: { marketItem: marketItemTest },
  });

  it("Should render with correct computed properties", () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm.balance).toBe(0);
    if (marketItemTest.hasOwnProperty("lpPrice")) {
      expect(wrapper.vm.balanceInUSD).toBeTypeOf("number");
    } else {
      expect(wrapper.vm.balanceInUSD).toBe(NaN);
    }
  });

  it("Should emit on click", () => {
    const marketItem = wrapper.find(".market-item");
    expect(marketItem.exists()).toBe(true);
    marketItem.trigger("click");

    expect(wrapper.emitted().changeActiveMarket.length).toBe(1);
    expect(wrapper.emitted().changeActiveMarket[0]).toContain(1);
  });
});
