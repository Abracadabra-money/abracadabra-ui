import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import BaseButton from "@/components/base/BaseButton.vue";
import FarmPosition from "@/components/farm/FarmPosition.vue";
import { emptyFarmData } from "@/helpers/farm/createFarmData";
import type { Address } from "viem";

const farm = {
  ...emptyFarmData,
  farmRoi: 0.1,
  farmTvl: 1000000,
  stakingToken: {
    link: "https://example.com",
    name: "Token A",
    type: "",
    contractInfo: { address: "0x0000000" as Address, abi: [] },
  },
};

describe("FarmPosition", () => {
  it("renders deposited token information correctly", () => {
    const depositedTokenInfo = {
      earned: 100,
      usd: 200,
    };

    const wrapper = shallowMount(FarmPosition, {
      propsData: {
        selectedFarm: farm,
      },
      computed: {
        depositedTokenInfo: () => depositedTokenInfo,
      },
    });

    expect(wrapper.find(".deposited-token .token-name").text()).toBe("Token A");
    expect(wrapper.find(".deposited-token .value").text()).toBe("100");
    expect(wrapper.find(".deposited-token .usd").text()).toBe("200");
  });

  it("renders reward tokens information correctly", () => {
    const wrapper = shallowMount(FarmPosition, {
      propsData: {
        selectedFarm: {
          ...farm,
          isMultiReward: true,
          accountInfo: {
            allowance: "0",
            userReward: "0",
            balance: "0",
            depositedBalance: "0",
            depositedBalanceBigInt: 0n,
            rewardTokensInfo: [
              {
                name: "Token B",
                earned: 50,
                price: 2,
                balance: "0",
                allowance: "0",
                rewards: "0",
                usd: "0",
                icon: "",
                address: "0x000" as Address,
                decimals: 18,
                abi: [],
                oracle: "0x000" as Address,
              },
              {
                name: "Token C",
                earned: 75,
                price: 3,
                balance: "0",
                allowance: "0",
                rewards: "0",
                usd: "0",
                icon: "",
                address: "0x000" as Address,
                decimals: 18,
                abi: [],
                oracle: "0x000" as Address,
              },
            ],
            userInfo: {
              amount: "100",
              amountBigInt: 100n,
              rewardDebt: "0",
              remainingIceTokenReward: "0,",
            },
          },
        },
      },
    });

    const rewardTokens = wrapper.findAll(".reward-token");
    expect(rewardTokens.length).toBe(2);

    expect(rewardTokens[0].find(".token-name").text()).toBe("Token B");
    expect(rewardTokens[0].find(".value").text()).toBe("50");
    expect(rewardTokens[0].find(".usd").text()).toBe("$ 100");

    expect(rewardTokens[1].find(".token-name").text()).toBe("Token C");
    expect(rewardTokens[1].find(".value").text()).toBe("75");
    expect(rewardTokens[1].find(".usd").text()).toBe("$ 225");
  });

  it("disables the earned button when there is insufficient reward or improper network", () => {
    const selectedFarm = {
      ...farm,
      isMultiReward: true,
      accountInfo: {
        allowance: "0",
        userReward: "0",
        balance: "0",
        depositedBalance: "0",
        depositedBalanceBigInt: 0n,
        rewardTokensInfo: [
          {
            name: "Token B",
            earned: 50,
            price: 2,
            balance: "0",
            allowance: "0",
            rewards: "0",
            usd: "0",
            icon: "",
            address: "0x000" as Address,
            decimals: 18,
            abi: [],
            oracle: "0x000" as Address,
          },
          {
            name: "Token C",
            earned: 75,
            price: 3,
            balance: "0",
            allowance: "0",
            rewards: "0",
            usd: "0",
            icon: "",
            address: "0x000" as Address,
            decimals: 18,
            abi: [],
            oracle: "0x000" as Address,
          },
        ],
        userInfo: {
          amount: "100",
          amountBigInt: 100n,
          rewardDebt: "0",
          remainingIceTokenReward: "0,",
        },
      },
    };

    const isProperNetwork = false;

    const wrapper = shallowMount(FarmPosition, {
      propsData: {
        selectedFarm,
        isProperNetwork,
      },
    });

    expect(wrapper.findComponent(BaseButton).props("disabled")).toBe(true);
  });

  it("enables the earned button when there is sufficient reward and proper network", () => {
    const isProperNetwork = true;

    const wrapper = shallowMount(FarmPosition, {
      propsData: {
        selectedFarm: {
          ...farm,
          isMultiReward: true,
          accountInfo: {
            allowance: "0",
            userReward: "0",
            balance: "0",
            depositedBalance: "0",
            depositedBalanceBigInt: 0n,
            rewardTokensInfo: [
              {
                name: "Token B",
                earned: 50,
                price: 2,
                balance: "0",
                allowance: "0",
                rewards: "0",
                usd: "0",
                icon: "",
                address: "0x000" as Address,
                decimals: 18,
                abi: [],
                oracle: "0x000" as Address,
              },
              {
                name: "Token C",
                earned: 75,
                price: 3,
                balance: "0",
                allowance: "0",
                rewards: "0",
                usd: "0",
                icon: "",
                address: "0x000" as Address,
                decimals: 18,
                abi: [],
                oracle: "0x000" as Address,
              },
            ],
            userInfo: {
              amount: "100",
              amountBigInt: 100n,
              rewardDebt: "0",
              remainingIceTokenReward: "0,",
            },
          },
        },
        isProperNetwork,
      },
    });

    expect(wrapper.findComponent(BaseButton).props("disabled")).toBe(false);
  });
});
