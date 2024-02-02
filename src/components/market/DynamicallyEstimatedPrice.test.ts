import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import DynamicallyEstimatedPrice from "@/components/market/DynamicallyEstimatedPrice.vue";
import { utils } from "ethers";

describe("DynamicallyEstimatedPrice", () => {
  it("renders DynamicFee component when chainId is not 2222", () => {
    const wrapper = shallowMount(DynamicallyEstimatedPrice, {
      props: {
        cauldron: {
          config: {
            chainId: 1111,
            mimInfo: {
              address: "0x1234567890",
            },
            cauldronSettings: {
              isGMXMarket: true,
            },
          },
        },
        multiplier: 2,
        amount: utils.parseUnits("100"),
        isClose: false,
      },
    });

    expect(wrapper.findComponent({ name: "DynamicFee" }).exists()).toBe(true);
  });

  it("renders DynamicApr component", () => {
    const wrapper = shallowMount(DynamicallyEstimatedPrice, {
      props: {
        cauldron: {
          config: {
            chainId: 2222,
            mimInfo: {
              address: "0x1234567890",
            },
            cauldronSettings: {
              isGMXMarket: true,
            },
          },
        },
        multiplier: 2,
        amount: utils.parseUnits("100"),
        isClose: false,
      },
    });

    expect(wrapper.findComponent({ name: "DynamicApr" }).exists()).toBe(true);
  });

  it("renders GmPriceImpact component when isGMXMarket is true", () => {
    const wrapper = shallowMount(DynamicallyEstimatedPrice, {
      props: {
        cauldron: {
          config: {
            chainId: 2222,
            mimInfo: {
              address: "0x1234567890",
            },
            cauldronSettings: {
              isGMXMarket: true,
            },
          },
        },
        multiplier: 2,
        amount: utils.parseUnits("100"),
        isClose: false,
      },
    });

    expect(wrapper.findComponent({ name: "GmPriceImpact" }).exists()).toBe(
      true
    );
  });

  it("does not render GmPriceImpact component when isGMXMarket is false", () => {
    const wrapper = shallowMount(DynamicallyEstimatedPrice, {
      props: {
        cauldron: {
          config: {
            chainId: 2222,
            mimInfo: {
              address: "0x1234567890",
            },
            cauldronSettings: {
              isGMXMarket: false,
            },
          },
        },
        multiplier: 2,
        amount: utils.parseUnits("100"),
        isClose: false,
      },
    });

    expect(wrapper.findComponent({ name: "GmPriceImpact" }).exists()).toBe(
      false
    );
  });
});
