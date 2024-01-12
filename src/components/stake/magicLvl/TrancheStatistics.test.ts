import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import TrancheStatistics from "./TrancheStatistics.vue";

describe("TrancheStatistics", () => {
  it("renders correctly", () => {
    const wrapper = shallowMount(TrancheStatistics, {
      props: {
        stakeInfo: {
          senior: {
            stakeToken: {
              icon: "icon-url",
            },
          },
          mezzanine: {},
          junior: {},
          tranchesStatistics: {
            seniorApy: 10,
            seniorTotalRewardsUsd: 100,
            mezzanineApy: 5,
            mezzanineTotalRewardsUsd: 50,
            juniorApy: 2,
            juniorTotalRewardsUsd: 20,
            totalRewardsUsd: 170,
            totalSupplyUsd: 1000,
          },
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
  });
});
