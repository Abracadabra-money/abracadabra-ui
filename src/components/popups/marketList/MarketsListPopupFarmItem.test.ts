import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import MarketsListPopupFarmItem from "@/components/popups/marketList/MarketsListPopupFarmItem.vue";
import { emptyFarmData } from "@/helpers/farm/createFarmData";

const marketItem = {
  ...emptyFarmData,
  id: 1,
  chainId: 1,
};

describe("MarketsListPopupFarmItem", () => {
  it("renders correctly", () => {
    const wrapper = shallowMount(MarketsListPopupFarmItem, {
      propsData: {
        marketItem,
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("emits changeActiveMarket event when item is chosen", () => {
    const wrapper = shallowMount(MarketsListPopupFarmItem, {
      propsData: {
        marketItem,
      },
    });

    wrapper.find(".market-item").trigger("click");

    expect(wrapper.emitted("changeActiveMarket")).toBeTruthy();
    expect(wrapper.emitted("changeActiveMarket")![0][0]).toEqual({
      id: marketItem.id,
      chainId: marketItem.chainId,
    });
  });
});
