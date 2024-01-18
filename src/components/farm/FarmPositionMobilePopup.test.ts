import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import FarmPositionMobilePopup from "@/components/farm/FarmPositionMobilePopup.vue";

describe("FarmPositionMobilePopup", () => {
  it("renders the component", () => {
    const wrapper = shallowMount(FarmPositionMobilePopup, {
      propsData: {
        selectedFarm: {
          accountInfo: {
            userInfo: {
              amount: 100,
            },
          },
          stakingToken: {
            name: "Token A",
          },
        },
        isProperNetwork: true,
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("emits the closePopup event when close button is clicked", () => {
    const wrapper = shallowMount(FarmPositionMobilePopup, {
      propsData: {
        selectedFarm: {
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
        },
        isProperNetwork: true,
      },
    });

    wrapper.find(".close").trigger("click");

    expect(wrapper.emitted("closePopup")).toBeTruthy();
  });

  it("displays the deposited token name", () => {
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
          amount: 100000000,
        },
      },
      stakingToken: {
        name: "Token A",
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

  it("displays the deposited token amount in USD", () => {
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
          amount: 100000000,
        },
      },
      stakingToken: {
        name: "Token A",
      },
      earnedTokenPrice: 2,
    };

    const wrapper = shallowMount(FarmPositionMobilePopup, {
      propsData: {
        selectedFarm,
        isProperNetwork: true,
      },
    });

    const depositedTokenAmountUsd = wrapper.find(
      ".deposited-token .token-amount .usd"
    );
    expect(depositedTokenAmountUsd.text()).toBe("$ 200,000,000");
  });
});
