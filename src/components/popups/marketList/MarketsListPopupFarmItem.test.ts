import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import MarketsListPopupFarmItem from "@/components/popups/marketList/MarketsListPopupFarmItem.vue";

describe("MarketsListPopupFarmItem", () => {
  it("renders correctly", () => {
    const marketItem = {
      id: 1,
      chainId: 1,
    };

    const wrapper = shallowMount(MarketsListPopupFarmItem, {
      propsData: {
        marketItem,
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("emits changeActiveMarket event when item is chosen", () => {
    const marketItem = {
      id: 1,
      chainId: 1,
    };

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
