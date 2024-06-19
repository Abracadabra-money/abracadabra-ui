import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import FarmPositionMobilePopup from "@/components/farm/FarmPositionMobilePopup.vue";
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

describe("FarmPositionMobilePopup", () => {
  it("renders the component", () => {
    const wrapper = shallowMount(FarmPositionMobilePopup, {
      propsData: {
        selectedFarm: farm,
        isProperNetwork: true,
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("emits the closePopup event when close button is clicked", () => {
    const wrapper = shallowMount(FarmPositionMobilePopup, {
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
        isProperNetwork: true,
      },
    });

    wrapper.find(".close").trigger("click");

    expect(wrapper.emitted("closePopup")).toBeTruthy();
  });

  it("displays the deposited token name", () => {
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

    const wrapper = shallowMount(FarmPositionMobilePopup, {
      propsData: {
        selectedFarm,
        isProperNetwork: true,
      },
    });

    const depositedTokenName = wrapper.find(".deposited-token .token-name");
    expect(depositedTokenName.text()).toBe(selectedFarm.stakingToken.name);
  });

  it("displays the deposited token amount", () => {
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
      earnedTokenPrice: 2,
    };

    const wrapper = shallowMount(FarmPositionMobilePopup, {
      propsData: {
        selectedFarm,
        isProperNetwork: true,
      },
    });

    const depositedTokenAmount = wrapper.findAll(".value");

    expect(depositedTokenAmount[1].text()).toBe("50");
  });
});
