import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import BentoBoxItem from "@/components/myPositions/BentoBoxItem.vue";

describe("BentoBoxItem", () => {
  it("renders the component properly", () => {
    const wrapper = shallowMount(BentoBoxItem, {
      propsData: {
        isBento: true,
        balance: 100n,
        mimPrice: 1,
        activeChains: [1, 2, 3],
        activeChain: 1,
        currentChain: 1,
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("displays the correct title", () => {
    const wrapper = shallowMount(BentoBoxItem, {
      propsData: {
        isBento: true,
        balance: 100n,
        mimPrice: 1,
        activeChains: [1, 2, 3],
        activeChain: 1,
        currentChain: 1,
      },
    });

    expect(wrapper.find(".bento-title").text()).toBe("BentoBox");
  });

  it("displays the correct button text", () => {
    const wrapper = shallowMount(BentoBoxItem, {
      propsData: {
        isBento: true,
        balance: 100n,
        mimPrice: 1,
        activeChains: [1, 2, 3],
        activeChain: 1,
        currentChain: 1,
      },
    });

    expect(wrapper.find(".withdraw-button").text()).toBe("Withdraw");
  });
});
