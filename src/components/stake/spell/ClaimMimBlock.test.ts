import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import ClaimMimBlock from "@/components/stake/spell/ClaimMimBlock.vue";

describe("ClaimMimBlock", () => {
  it("renders the correct button text when isUnsupportedChain is false", () => {
    const wrapper = shallowMount(ClaimMimBlock, {
      propsData: {
        claimAmount: "100",
        isUnsupportedChain: false,
        isDisableClaimButton: true,
      },
    });

    expect(wrapper.find(".claim-button").text()).toBe("Switch Network");
  });

  it("renders the correct button text when isUnsupportedChain is true", () => {
    const wrapper = shallowMount(ClaimMimBlock, {
      propsData: {
        claimAmount: "100",
        isUnsupportedChain: true,
        isDisableClaimButton: true,
      },
    });

    expect(wrapper.find(".claim-button").text()).toBe("Claim");
  });

  it("formats the claim amount correctly", () => {
    const wrapper = shallowMount(ClaimMimBlock, {
      propsData: {
        claimAmount: "1000000000000000000",
        isUnsupportedChain: true,
        isDisableClaimButton: true,
      },
    });

    expect(wrapper.find(".token-amount").text()).toBe(
      "1,000,000,000,000,000,000"
    );
  });
});
