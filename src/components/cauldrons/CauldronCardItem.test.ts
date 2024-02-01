import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import CauldronCardItem from "@/components/cauldrons/CauldronCardItem.vue";
import { utils } from "ethers";

describe("CauldronCardItem", () => {
  it("renders correctly", () => {
    const cauldron = {
      config: {
        chainId: 1,
        id: 1,
        cauldronSettings: {
          isNew: true,
          isDepreciated: false,
        },
      },
      userPosition: {
        collateralInfo: {
          userCollateralShare: {
            gt: vi.fn().mockReturnValue(true),
          },
        },
        borrowInfo: {
          userBorrowPart: {
            gt: vi.fn().mockReturnValue(false),
          },
        },
      },
      apr: {
        value: 10,
        multiplier: 2,
      },
      mainParams: {
        tvl: "1000000",
        totalBorrowed: "500000",
        mimLeftToBorrow: "200000",
        interest: 5,
      },
    };

    const wrapper = shallowMount(CauldronCardItem, {
      propsData: {
        cauldron,
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("calculates loopApr correctly", () => {
    const cauldron = {
      config: {},
      userPosition: {
        collateralInfo: {
          userCollateralShare: utils.parseUnits("1", 18),
        },
      },
      apr: {
        value: 10,
        multiplier: 2,
      },
      mainParams: {
        tvl: "1000000",
        totalBorrowed: "500000",
        mimLeftToBorrow: "200000",
      },
    };

    const wrapper = shallowMount(CauldronCardItem, {
      propsData: {
        cauldron,
      },
    });

    expect(wrapper.vm.loopApr).toBe("10% - 20.0%");
  });
});
