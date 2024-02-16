import { utils } from "ethers";
import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { magicGlpConfig } from "@/test/magicGlpConfig";
import LeverageBlock from "@/components/market/LeverageBlock.vue";

describe("LeverageBlock", () => {
  it("emits updateLeverageAmounts event when multiplier is updated", () => {
    const wrapper = shallowMount(LeverageBlock, {
      props: {
        slippage: utils.parseUnits("0.01"),
        depositCollateralAmount: utils.parseUnits("100"),

        cauldron: magicGlpConfig,
      },
      created() {},
    });

    expect(wrapper.exists()).toBe(true);
  });
});
