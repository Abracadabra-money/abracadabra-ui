import { shallowMount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import AprTooltip from "@/components/ui/tooltips/AprTooltip.vue";
import { emptyFarmData } from "@/helpers/farm/createFarmData";
import type { Address } from "viem";

const farm = {
  ...emptyFarmData,
  config: {
    name: "",
    icon: "",
    contractChain: 1,
    id: 0,
    stakingToken: {
      name: "",
      type: "",
      link: "",
      decimals: 18,
      abi: [],
    },
    contract: {
      name: "",
      address: "0x00000" as Address,
      abi: [],
    },
    rewardTokens: [
      {
        address: "0x123" as Address,
        icon: "token1.png",
        name: "token1",
        decimals: 18,
        oracle: "0x123" as Address,
        abi: [],
      },
      {
        address: "0x456" as Address,
        icon: "token2.png",
        name: "token2",
        decimals: 18,
        oracle: "0x456" as Address,
        abi: [],
      },
    ],
  },
  farmRoi: 0.15,
};

describe("AprTooltip", () => {
  it("renders correctly", () => {
    const wrapper = shallowMount(AprTooltip, {
      props: {
        farm: farm,
        top: false,
      },
    });

    expect(wrapper.exists()).toBe(true);
    // Add more assertions to test the rendered output
  });

  // Add more test cases as needed
});
