import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import CauldronsTableItem from "@/components/cauldrons/CauldronsTableItem.vue";
import { useImage } from "@/helpers/useImage";

describe("CauldronsTableItem", () => {
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
        value: 5,
        multiplier: 1.2,
      },
      mainParams: {
        tvl: "1000000000000000000",
        totalBorrowed: "500000000000000000",
        mimLeftToBorrow: "200000000000000000",
        interest: 10,
      },
    };

    const wrapper = shallowMount(CauldronsTableItem, {
      propsData: {
        cauldron,
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".cauldrons-table-link").classes()).toContain("new");
    expect(wrapper.find(".label").exists()).toBe(true);
    expect(wrapper.findAll(".column")[1].text()).toBe("$1");
    expect(wrapper.find(".apr").text()).toBe("5% - 6.0%");
  });

  it("calculates the correct chain icon", () => {
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
        value: 5,
        multiplier: 1.2,
      },
      mainParams: {
        tvl: "1000000000000000000",
        totalBorrowed: "500000000000000000",
        mimLeftToBorrow: "200000000000000000",
        interest: 10,
      },
    };

    const wrapper = shallowMount(CauldronsTableItem, {
      propsData: {
        cauldron,
      },
    });

    expect(wrapper.vm.getChainIcon(1)).toBe(
      useImage("assets/images/chains/ethereum.svg")
    );
  });

  it("formats units correctly", () => {
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
        value: 5,
        multiplier: 1.2,
      },
      mainParams: {
        tvl: "1000000000000000000",
        totalBorrowed: "500000000000000000",
        mimLeftToBorrow: "200000000000000000",
        interest: 10,
      },
    };
    const wrapper = shallowMount(CauldronsTableItem, {
      propsData: {
        cauldron,
      },
    });

    expect(wrapper.vm.formatUnits("1000000000000000000")).toBe("1.0");
  });

  it("formats large sums correctly", () => {
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
        value: 5,
        multiplier: 1.2,
      },
      mainParams: {
        tvl: "1000000000000000000",
        totalBorrowed: "500000000000000000",
        mimLeftToBorrow: "200000000000000000",
        interest: 10,
      },
    };
    const wrapper = shallowMount(CauldronsTableItem, {
      propsData: {
        cauldron,
      },
    });

    expect(wrapper.vm.formatLargeSum("1000000000000000000")).toBe("1");
  });

  it("navigates to the correct page", () => {
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
        value: 5,
        multiplier: 1.2,
      },
      mainParams: {
        tvl: "1000000000000000000",
        totalBorrowed: "500000000000000000",
        mimLeftToBorrow: "200000000000000000",
        interest: 10,
      },
    };

    const wrapper = shallowMount(CauldronsTableItem, {
      propsData: {
        cauldron,
      },
    });

    const expectedRoute = {
      name: "Market",
      params: {
        chainId: 1,
        cauldronId: 1,
      },
    };

    expect(wrapper.vm.goToPage(cauldron)).toEqual(expectedRoute);
  });
});
