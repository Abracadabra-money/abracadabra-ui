import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import BaseButton from "@/components/base/BaseButton.vue";
import FarmPosition from "@/components/farm/FarmPosition.vue";

describe("FarmPosition", () => {
  it("renders deposited token information correctly", () => {
    const selectedFarm = {
      stakingToken: {
        name: "Token A",
      },
    };
    const depositedTokenInfo = {
      earned: 100,
      usd: 200,
    };

    const wrapper = shallowMount(FarmPosition, {
      propsData: {
        selectedFarm,
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
    const selectedFarm = {
      isMultiReward: true,
      accountInfo: {
        rewardTokensInfo: [
          {
            name: "Token B",
            earned: 50,
            price: 2,
          },
          {
            name: "Token C",
            earned: 75,
            price: 3,
          },
        ],
        userInfo: {
          amount: 100,
        },
      },
      stakingToken: {
        name: "Token A",
      },
    };

    const wrapper = shallowMount(FarmPosition, {
      propsData: {
        selectedFarm,
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
      isMultiReward: true,
      accountInfo: {
        rewardTokensInfo: [
          {
            name: "Token B",
            earned: 50,
            price: 2,
          },
          {
            name: "Token C",
            earned: 75,
            price: 3,
          },
        ],
        userInfo: {
          amount: 100,
        },
      },
      stakingToken: {
        name: "Token A",
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
    const selectedFarm = {
      isMultiReward: true,
      accountInfo: {
        rewardTokensInfo: [
          {
            name: "Token B",
            earned: 50,
            price: 2,
          },
          {
            name: "Token C",
            earned: 75,
            price: 3,
          },
        ],
        userInfo: {
          amount: 100,
        },
      },
      stakingToken: {
        name: "Token A",
      },
    };
    const isProperNetwork = true;

    const wrapper = shallowMount(FarmPosition, {
      propsData: {
        selectedFarm,
        isProperNetwork,
      },
    });

    expect(wrapper.findComponent(BaseButton).props("disabled")).toBe(false);
  });
});
