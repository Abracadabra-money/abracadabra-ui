import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import BorrowBlock from "@/components/market/BorrowBlock.vue";
import { magicGlpConfig } from "@/test/magicGlpConfig";
import { BigNumber } from "ethers";

describe("BorrowBlock", () => {
  it("renders the BorrowBlock component", () => {
    const wrapper = mount(BorrowBlock, {
      props: {
        cauldron: magicGlpConfig,
        inputAmount: BigNumber.from(0),
        collateralTokenAmount: BigNumber.from(100),
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("emits the updateBorrowAmount event when onUpdateBorrowValue is called", () => {
    const wrapper = mount(BorrowBlock, {
      props: {
        cauldron: magicGlpConfig,
        inputAmount: BigNumber.from(0),
        collateralTokenAmount: BigNumber.from(100),
      },
    });
    const borrowAmount = BigNumber.from(100);
    wrapper.vm.onUpdateBorrowValue(borrowAmount);
    expect(wrapper.emitted("updateBorrowAmount")).toBeTruthy();
    expect(wrapper.emitted("updateBorrowAmount")?.[0]?.[0]).toBe(borrowAmount);
  });
});
