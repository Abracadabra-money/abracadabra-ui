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
};

describe("MarketsListPopupFarmItem.vue", () => {
  const tooltip = vi.fn();
  it("Should render with correct computed properties", () => {
    console.log(marketItemTest);

    const wrapper = mount(MarketsListPopupFarmItem, {
      props: { marketItem: marketItemTest },
      global: {
        directives: { tooltip },
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm.balance).toBe(0);
    if (marketItemTest.hasOwnProperty("lpPrice")) {
      expect(wrapper.vm.balanceInUSD).toBeTypeOf("number");
    } else {
      expect(wrapper.vm.balanceInUSD).toBe(NaN);
    }
  });
});
