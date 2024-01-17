import { parseUnits } from "viem";
import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import TrancheStatisticsItem from "@/components/stake/magicLvl/TrancheStatisticsItem.vue";

describe("TrancheStatisticsItem", () => {
  it("renders the component correctly", () => {
    const wrapper = shallowMount(TrancheStatisticsItem, {
      propsData: {
        data: {
          mainToken: {
            icon: "path/to/icon.png",
            totalSupplyUsd: 1000,
          },
          name: "Tranche A",
        },
        apy: 5,
        rewards: 100,
        deprecated: false,
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("displays the correct title", () => {
    const wrapper = shallowMount(TrancheStatisticsItem, {
      propsData: {
        data: {
          mainToken: {
            icon: "path/to/icon.png",
            totalSupplyUsd: 1000,
          },
          name: "Tranche A",
        },
        apy: 5,
        rewards: 100,
        deprecated: false,
      },
    });

    const title = wrapper.find(".title");
    expect(title.text()).toBe("Tranche A tranche");
  });

  it("displays the correct main token icon", () => {
    const wrapper = shallowMount(TrancheStatisticsItem, {
      propsData: {
        data: {
          mainToken: {
            icon: "path/to/icon.png",
            totalSupplyUsd: 1000,
          },
          name: "Tranche A",
        },
        apy: 5,
        rewards: 100,
        deprecated: false,
      },
    });

    const mainTokenIcon = wrapper.find(".icon");
    expect(mainTokenIcon.attributes("src")).toBe("path/to/icon.png");
  });

  it("displays the correct total supply in USD", () => {
    const wrapper = shallowMount(TrancheStatisticsItem, {
      propsData: {
        data: {
          mainToken: {
            icon: "path/to/icon.png",
            totalSupplyUsd: parseUnits("1000", 18),
          },
          name: "Tranche A",
        },
        apy: 5,
        rewards: 100,
        deprecated: false,
      },
    });

    const totalSupply = wrapper.findAll(".value");
    expect(totalSupply[2].text()).toBe("$ 1,000");
  });

  it("displays the correct APY", () => {
    const wrapper = shallowMount(TrancheStatisticsItem, {
      propsData: {
        data: {
          mainToken: {
            icon: "path/to/icon.png",
            totalSupplyUsd: 1000,
          },
          name: "Tranche A",
        },
        apy: 5,
        rewards: 100,
        deprecated: false,
      },
    });

    const apy = wrapper.findAll(".value");
    expect(apy[0].text()).toBe("5%");
  });

  it("displays the correct rewards", () => {
    const wrapper = shallowMount(TrancheStatisticsItem, {
      propsData: {
        data: {
          mainToken: {
            icon: "path/to/icon.png",
            totalSupplyUsd: 1000,
          },
          name: "Tranche A",
        },
        apy: 5,
        rewards: 100,
        deprecated: false,
      },
    });

    const rewards = wrapper.findAll(".value");
    expect(rewards[1].text()).toBe("$ 100");
  });

  it("displays the deprecated message if deprecated prop is true", () => {
    const wrapper = shallowMount(TrancheStatisticsItem, {
      propsData: {
        data: {
          mainToken: {
            icon: "path/to/icon.png",
            totalSupplyUsd: 1000,
          },
          name: "Tranche A",
        },
        apy: 5,
        rewards: 100,
        deprecated: true,
      },
    });

    const deprecatedMessage = wrapper.find(".deprecated-label");
    expect(deprecatedMessage.exists()).toBe(true);
  });
});
