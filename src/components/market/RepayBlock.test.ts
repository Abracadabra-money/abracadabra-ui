import { BigNumber } from "ethers";
import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { magicGlpConfig } from "@/test/magicGlpConfig";
import RepayBlock from "@/components/market/RepayBlock.vue";

describe("RepayBlock", () => {
  it("renders the title and subtitle correctly", () => {
    const wrapper = shallowMount(RepayBlock, {
      props: {
        cauldron: magicGlpConfig,
        inputAmount: BigNumber.from("0"),
        withdrawAmount: BigNumber.from("0"),
      },
    });

    expect(wrapper.find(".title").text()).toBe("Repay MIM");
    expect(wrapper.find(".subtitle").text()).toBe(
      "Select the amount of MIM to repay"
    );
  });

  it("emits the correct updateRepayAmount event when input value is updated", async () => {
    const wrapper = shallowMount(RepayBlock, {
      props: {
        cauldron: magicGlpConfig,
        inputAmount: BigNumber.from("0"),
        withdrawAmount: BigNumber.from("0"),
      },
    });

    const baseTokenInput = wrapper.findComponent({ name: "BaseTokenInput" });
    await baseTokenInput.vm.$emit("updateInputValue", "10");

    expect(wrapper.emitted("updateRepayAmount")).toBeTruthy();
    expect(wrapper.emitted("updateRepayAmount")?.[0]?.[0]).toEqual("10");
  });
});
