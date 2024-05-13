import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import TokenChainIcon from "@/components/ui/icons/TokenChainIcon.vue";

describe("TokenChainIcon", () => {
  it("renders the BaseTokenIcon component", () => {
    const wrapper = shallowMount(TokenChainIcon, {
      propsData: {
        name: "tokenName",
        icon: "tokenIcon",
        chainId: 1,
        size: "32px",
      },
    });

    expect(wrapper.findComponent({ name: "BaseTokenIcon" }).exists()).toBe(
      true
    );
  });

  it("renders the token chain image if name is provided", () => {
    const wrapper = shallowMount(TokenChainIcon, {
      propsData: {
        name: "tokenName",
        icon: "tokenIcon",
        chainId: 1,
        size: "32px",
      },
    });

    expect(wrapper.find(".token-chain").exists()).toBe(true);
  });

  it("does not render the token chain image if name is not provided", () => {
    const wrapper = shallowMount(TokenChainIcon, {
      propsData: {
        name: "",
        icon: "tokenIcon",
        chainId: 1,
        size: "32px",
      },
    });

    expect(wrapper.find(".token-chain").exists()).toBe(false);
  });

  // Add more test cases as needed
});
