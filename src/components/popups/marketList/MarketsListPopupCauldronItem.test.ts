import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import MarketsListPopupCauldronItem from "@/components/popups/marketList/MarketsListPopupCauldronItem.vue";

const tooltip = vi.fn();

describe("MarketsListPopupCauldronItem", () => {
  it("renders correctly", () => {
    const marketItem = {
      config: {
        id: 1,
        name: "Market 1",
        icon: "market1.png",
        cauldronSettings: {
          isMigrated: true,
        },
        wrapInfo: {
          unwrappedToken: {
            name: "Token 1",
          },
          isHiddenWrap: false,
        },
      },
      userInfo: {
        collateralAmount: 100,
        collateralAmountUsd: 1000,
        unwrappedTokenAmount: 200,
        unwrappedTokenAmountUsd: 2000,
      },
    };

    const wrapper = shallowMount(MarketsListPopupCauldronItem, {
      propsData: {
        marketItem,
      },
      global: { directives: { tooltip } },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".market-item-wrap").exists()).toBe(true);
    expect(wrapper.find(".market-item").exists()).toBe(true);
    expect(wrapper.find(".cauldron-info").exists()).toBe(true);
    expect(wrapper.find(".value-title").exists()).toBe(true);
    expect(wrapper.find(".name").exists()).toBe(true);
    expect(wrapper.find(".tooltip").exists()).toBe(true);
    expect(wrapper.find(".cauldron-balance").exists()).toBe(true);
    expect(wrapper.find(".price").exists()).toBe(true);
  });

  it("emits changeActiveMarket event when choseItem method is called", () => {
    const marketItem = {
      config: {
        id: 1,
        name: "Market 1",
        icon: "market1.png",
        cauldronSettings: {
          isMigrated: true,
        },
        wrapInfo: {
          unwrappedToken: {
            name: "Token 1",
          },
          isHiddenWrap: false,
        },
      },
      userInfo: {
        collateralAmount: 100,
        collateralAmountUsd: 1000,
        unwrappedTokenAmount: 200,
        unwrappedTokenAmountUsd: 2000,
      },
    };

    const wrapper = shallowMount(MarketsListPopupCauldronItem, {
      propsData: {
        marketItem,
      },
      global: { directives: { tooltip } },
    });

    wrapper.vm.choseItem(marketItem);

    expect(wrapper.emitted("changeActiveMarket")).toBeTruthy();
    expect(wrapper.emitted("changeActiveMarket")![0][0]).toBe(
      marketItem.config.id
    );
  });
});
