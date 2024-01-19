import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import PositionAssets from "@/components/myPositions/PositionAssets.vue";

describe("PositionAssets", () => {
  it("renders assets correctly", () => {
    const assetsInfo = {
      asset1: {
        title: "Asset 1",
        icon: "icon1",
        name: "Asset 1",
        symbol: "A1",
        amount: 10,
        amountUsd: 100,
      },
      asset2: {
        title: "Asset 2",
        icon: "icon2",
        name: "Asset 2",
        symbol: "A2",
        amount: 20,
        amountUsd: 200,
      },
    };

    const wrapper = shallowMount(PositionAssets, {
      propsData: {
        assetsInfo,
      },
    });

    // Assert that the component renders correctly
    expect(wrapper.exists()).toBe(true);

    // Assert that the assets are rendered correctly
    const assetElements = wrapper.findAll(".asset");
    expect(assetElements.length).toBe(Object.keys(assetsInfo).length);

    // Assert that the asset titles are rendered correctly
    const assetTitleElements = wrapper.findAll(".asset-title");
    expect(assetTitleElements.length).toBe(Object.keys(assetsInfo).length);
    expect(assetTitleElements[0].text()).toBe(assetsInfo.asset1.title);
    expect(assetTitleElements[1].text()).toBe(assetsInfo.asset2.title);

    // Assert that the asset icons are rendered correctly
    const assetIconElements = wrapper.findAll(".token-icon");
    expect(assetIconElements.length).toBe(Object.keys(assetsInfo).length);
    expect(assetIconElements[0].attributes("icon")).toBe(
      assetsInfo.asset1.icon
    );
    expect(assetIconElements[1].attributes("icon")).toBe(
      assetsInfo.asset2.icon
    );

    // Assert that the asset names are rendered correctly
    const assetNameElements = wrapper.findAll(".token-name");
    expect(assetNameElements.length).toBe(Object.keys(assetsInfo).length);
    expect(assetNameElements[0].text()).toBe(assetsInfo.asset1.symbol);
    expect(assetNameElements[1].text()).toBe(assetsInfo.asset2.symbol);

    // Assert that the asset amounts are rendered correctly
    const assetAmountElements = wrapper.findAll(".token-value");
    expect(assetAmountElements.length).toBe(Object.keys(assetsInfo).length);
    expect(assetAmountElements[0].text()).toBe(
      assetsInfo.asset1.amount.toString()
    );
    expect(assetAmountElements[1].text()).toBe(
      assetsInfo.asset2.amount.toString()
    );

    // Assert that the asset USD equivalents are rendered correctly
    const assetUsdEquivalentElements = wrapper.findAll(".usd-equivalent");
    expect(assetUsdEquivalentElements.length).toBe(
      Object.keys(assetsInfo).length
    );
    expect(assetUsdEquivalentElements[0].text()).toBe(
      assetsInfo.asset1.amountUsd.toString()
    );
    expect(assetUsdEquivalentElements[1].text()).toBe(
      assetsInfo.asset2.amountUsd.toString()
    );
  });
});
