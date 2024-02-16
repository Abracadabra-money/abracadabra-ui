import { utils } from "ethers";
import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { magicGlpConfig } from "@/test/magicGlpConfig";
import RemoveCollateralRangeBlock from "@/components/market/RemoveCollateralRangeBlock.vue";

describe("RemoveCollateralRangeBlock", () => {
  it("renders the component", () => {
    const wrapper = shallowMount(RemoveCollateralRangeBlock, {
      props: {
        cauldron: magicGlpConfig,
        withdrawAmount: utils.parseUnits("1"),
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("emits 'updateWithdrawAmount' event when 'onUpdateWithdrawValue' is called", () => {
    const wrapper = shallowMount(RemoveCollateralRangeBlock, {
      props: {
        cauldron: magicGlpConfig,
        withdrawAmount: utils.parseUnits("1"),
      },
    });
    const value = utils.parseEther("100");

    wrapper.vm.onUpdateWithdrawValue(value);

    expect(wrapper.emitted("updateWithdrawAmount")).toBeTruthy();
    expect(wrapper.emitted("updateWithdrawAmount")?.[0]?.[0]).toBe(value);
  });
});
