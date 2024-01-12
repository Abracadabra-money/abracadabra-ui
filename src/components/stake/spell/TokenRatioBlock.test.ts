import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import TokenRatioBlock from "@/components/stake/spell/TokenRatioBlock.vue";

describe("TokenRatioBlock", () => {
  it("renders the correct tokens ratio", () => {
    const mainToken = {
      name: "Main Token",
      rateIcon: "main-token-icon.svg",
      rate: BigInt(1500000000000000000),
      decimals: 18,
    };

    const stakeToken = {
      name: "Stake Token",
    };

    const wrapper = shallowMount(TokenRatioBlock, {
      propsData: {
        mainToken,
        stakeToken,
      },
    });

    const ratioValue = wrapper.find(".ratio-value");
    expect(ratioValue.text()).toBe("1 Main Token = 1.5 Stake Token");
  });
});
