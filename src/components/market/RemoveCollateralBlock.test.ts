import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import RemoveCollateralBlock from "@/components/market/RemoveCollateralBlock.vue";
import { BigNumber } from "ethers";
import { magicGlpConfig } from "@/test/magicGlpConfig";

describe("RemoveCollateralBlock", () => {
  it("emits updateWithdrawAmount event when input value is updated", async () => {
    const wrapper = shallowMount(RemoveCollateralBlock, {
      props: {
        cauldron: magicGlpConfig,
        inputAmount: BigNumber.from("0"),
        repayAmount: BigNumber.from("0"),
      },
    });

    const baseTokenInput = wrapper.findComponent({ name: "BaseTokenInput" });
    await baseTokenInput.vm.$emit("updateInputValue", "1");

    expect(wrapper.emitted("updateWithdrawAmount")).toBeTruthy();
    expect(wrapper.emitted("updateWithdrawAmount")?.[0]?.[0]).toEqual("1");
  });
});
