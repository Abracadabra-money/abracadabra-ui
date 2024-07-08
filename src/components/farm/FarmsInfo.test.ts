import Vuex from "vuex";
import { ethers } from "ethers";
import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import FarmsInfo from "@/components/farm/FarmsInfo.vue";
import { emptyFarmData } from "@/helpers/farm/createFarmData";
import type { Address } from "viem";

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

const farm = {
  ...emptyFarmData,
  accountInfo: {
    allowance: "0",
    userInfo: {
      amount: "0",
      amountBigInt: 0n,
      rewardDebt: "0",
      remainingIceTokenReward: "0",
    },
    userReward: "10",
    rewardTokensInfo: [
      {
        earned: "20",
        price: 0,
        balance: "0",
        allowance: "0",
        rewards: "0",
        usd: "0",
        name: "",
        icon: "",
        address: "0x000" as Address,
        decimals: 18,
        abi: [],
        oracle: "0x000" as Address,
      },
      {
        earned: "30",
        price: 2.5,
        balance: "0",
        allowance: "0",
        rewards: "0",
        usd: "0",
        name: "",
        icon: "",
        address: "0x000" as Address,
        decimals: 18,
        abi: [],
        oracle: "0x000" as Address,
      },
    ],
    balance: "0",
    depositedBalance: "0",
    depositedBalanceBigInt: 0n,
  },
  earnedTokenPrice: 1.5,
};

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
        farms: [farm],
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
        farms: [farm],
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
