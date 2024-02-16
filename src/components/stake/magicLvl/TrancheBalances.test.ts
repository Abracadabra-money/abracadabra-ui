import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import TrancheBalances from "@/components/stake/magicLvl/TrancheBalances.vue";

describe("TrancheBalances", () => {
  it("renders correctly", () => {
    const wrapper = shallowMount(TrancheBalances, {
      propsData: {
        trancheInfo: [
          {
            stakeToken: {
              name: "Stake Token 1",
              icon: "stake-token-1.png",
              rateIcon: "rate-icon-1.png",
              balance: 100,
              decimals: 18,
            },
            mainToken: {
              name: "Main Token 1",
              icon: "main-token-1.png",
              balance: 200,
              decimals: 18,
            },
            name: "Tranche 1",
            tokensRate: 1000000000000000000n,
          },
          // Add more trancheInfo objects as needed
        ],
      },
    });

    // Add your assertions here
    expect(wrapper.find(".wrapper").exists()).toBe(true);
    expect(wrapper.find(".title").text()).toBe("Your wallet balance");
    // Add more assertions as needed
  });

  it("formats token balance correctly", () => {
    const wrapper = shallowMount(TrancheBalances, {
      propsData: {
        trancheInfo: [
          {
            stakeToken: {
              name: "Stake Token 1",
              icon: "stake-token-1.png",
              rateIcon: "rate-icon-1.png",
              balance: 100000000000000000000n,
              decimals: 18,
            },
            mainToken: {
              name: "Main Token 1",
              icon: "main-token-1.png",
              balance: 200000000000000000000n,
              decimals: 18,
            },
            name: "Tranche 1",
            tokensRate: 1000000000000000000n,
          },
          // Add more trancheInfo objects as needed
        ],
      },
    });

    // Add your assertions here
    expect(wrapper.find(".token-info .token-name").text()).toBe(
      "Stake Token 1"
    );
    expect(wrapper.find(".token-info .token-icon").attributes("src")).toBe(
      "stake-token-1.png"
    );
    expect(wrapper.find(".token-info + div").text()).toBe("100");
    // Add more assertions as needed
  });

  it("calculates tokens rate correctly", () => {
    const wrapper = shallowMount(TrancheBalances, {
      propsData: {
        trancheInfo: [
          {
            stakeToken: {
              name: "Stake Token 1",
              icon: "stake-token-1.png",
              rateIcon: "rate-icon-1.png",
              balance: 100000000000000000000n,
              decimals: 18,
            },
            mainToken: {
              name: "Main Token 1",
              icon: "main-token-1.png",
              balance: 200000000000000000000n,
              decimals: 18,
            },
            name: "Tranche 1",
            tokensRate: 1000000000000000000n,
          },
          // Add more trancheInfo objects as needed
        ],
      },
    });

    // Add your assertions here
    expect(wrapper.find(".tokens-rate").text()).toBe(
      "1 Main Token 1 = 1 Stake Token 1"
    );
    // Add more assertions as needed
  });
});
