import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import DepositBlock from "@/components/market/DepositBlock.vue";
import { magicGlpConfig } from "@/test/magicGlpConfig";

describe("DepositBlock", () => {
  it("renders correctly", () => {
    const wrapper = shallowMount(DepositBlock, {
      props: {
        cauldron: magicGlpConfig,
        inputAmount: "10",
        useNativeToken: true,
        useUnwrapToken: false,
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".title").text()).toBe("Deposit collateral");
    expect(wrapper.find(".row").exists()).toBe(true);
    expect(wrapper.find(".subtitle").text()).toBe(
      "Select the amount of AETH to deposit in the Cauldron"
    );
  });
});
