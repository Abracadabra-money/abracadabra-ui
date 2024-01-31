import Vuex from "vuex";
import { ethers } from "ethers";
import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import FarmsInfo from "@/components/farm/FarmsInfo.vue";

const store = new Vuex.Store({
  modules: {
    connectProvider: {
      state: {
        account: ethers.Wallet.createRandom(),
      },
      getters: {
        getAccount: (state) => state.account,
      },
    },
  },
});

describe("FarmsInfo", () => {
  it("renders the title and description correctly", () => {
    const wrapper = shallowMount(FarmsInfo, {
      propsData: {
        farms: [],
      },
      global: { plugins: [store] },
    });

    const title = wrapper.find(".title");
    const description = wrapper.find(".description");

    expect(title.text()).toBe("Farming opportunities");
    expect(description.text()).toContain(
      "Enjoy the best yields for LPing MIM or Spell"
    );
  });

  it("calculates and displays the total spell rewards correctly", () => {
    const wrapper = shallowMount(FarmsInfo, {
      propsData: {
        farms: [
          {
            isMultiReward: false,
            accountInfo: {
              userReward: "10",
            },
            earnedTokenPrice: 1.5,
          },
        ],
      },
      global: { plugins: [store] },
    });

    const spellAmount = wrapper.find(".reward-card.spell .token-amount");
    const spellUsdEquivalent = wrapper.find(
      ".reward-card.spell .token-usd-equivalent"
    );

    expect(spellAmount.text()).toBe("10");
    expect(spellUsdEquivalent.text()).toBe("$ 15");
  });

  it("calculates and displays the total arbitrum rewards correctly", () => {
    const wrapper = shallowMount(FarmsInfo, {
      propsData: {
        farms: [
          {
            isMultiReward: true,
            accountInfo: {
              rewardTokensInfo: [
                { earned: "20" },
                { earned: "30", price: 2.5 },
              ],
            },
          },
        ],
      },
      global: { plugins: [store] },
    });

    const arbitrumAmount = wrapper.find(".reward-card.arbitrum .token-amount");
    const arbitrumUsdEquivalent = wrapper.find(
      ".reward-card.arbitrum .token-usd-equivalent"
    );

    expect(arbitrumAmount.text()).toBe("30");
    expect(arbitrumUsdEquivalent.text()).toBe("$ 75");
  });
});
