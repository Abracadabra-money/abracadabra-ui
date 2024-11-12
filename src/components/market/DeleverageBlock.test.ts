import { BigNumber } from "ethers";
import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { magicGlpConfig } from "@/test/magicGlpConfig";
import { gmArbTestConfig } from "@/test/gmArbTestConfig";
import DeleverageBlock from "@/components/market/DeleverageBlock.vue";

describe("DeleverageBlock", () => {
  it("renders AmountRange component", () => {
    const wrapper = shallowMount(DeleverageBlock, {
      props: {
        // @ts-ignore
        cauldron: magicGlpConfig,
        slippage: BigNumber.from(0),
        deleverageAmounts: {
          amountFrom: BigNumber.from(0),
          amountToMin: BigNumber.from(0),
        },
        withdrawAmount: BigNumber.from(0),
      },
    });

    expect(wrapper.findComponent({ name: "AmountRange" }).exists()).toBe(true);
  });

  it("renders DynamicFee component when chainId is not 2222", () => {
    const wrapper = shallowMount(DeleverageBlock, {
      props: {
        // @ts-ignore
        cauldron: magicGlpConfig,
        slippage: BigNumber.from(0),
        deleverageAmounts: {
          amountFrom: BigNumber.from(0),
          amountToMin: BigNumber.from(0),
        },
        withdrawAmount: BigNumber.from(0),
      },
    });

    expect(wrapper.findComponent({ name: "DynamicFee" }).exists()).toBe(true);
  });

  it("renders GmPriceImpact component when cauldronSettings.isGMXMarket is true", () => {
    const wrapper = shallowMount(DeleverageBlock, {
      props: {
        // @ts-ignore
        cauldron: gmArbTestConfig,
        slippage: BigNumber.from(0),
        deleverageAmounts: {
          amountFrom: BigNumber.from(0),
          amountToMin: BigNumber.from(0),
        },
        withdrawAmount: BigNumber.from(0),
      },
    });

    expect(wrapper.findComponent({ name: "GmPriceImpact" }).exists()).toBe(
      true
    );
  });
});
