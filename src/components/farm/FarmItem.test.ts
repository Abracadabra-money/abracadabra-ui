import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import FarmItem from "@/components/farm/FarmItem.vue";
import TokenChainIcon from "@/components/ui/icons/TokenChainIcon.vue";
import { emptyFarmData } from "@/helpers/farm/createFarmData";

const farm = {
  ...emptyFarmData,
  name: "Farm A",
  farmRoi: 0.05,
  farmTvl: 1000000,
  isDeprecated: true,
  icon: "farm-icon",
};

describe("FarmItem", () => {
  it("renders the farm name", () => {
    const wrapper = shallowMount(FarmItem, {
      propsData: {
        farm,
      },
    });

    expect(wrapper.find(".token-name").text()).toBe(farm.name);
  });

  it("renders the APR value", () => {
    const wrapper = shallowMount(FarmItem, {
      propsData: {
        farm,
      },
    });

    expect(wrapper.find(".tag-value").text()).toBe("0.05%");
  });

  it("renders the TVL value", () => {
    const wrapper = shallowMount(FarmItem, {
      propsData: {
        farm,
      },
    });

    expect(wrapper.findAll(".tag-value")[1].text()).toBe("$ 1,000,000");
  });

  it("renders the farm status flag", () => {
    const wrapper = shallowMount(FarmItem, {
      propsData: {
        farm,
      },
    });

    expect(wrapper.find(".status-flag-text").text()).toBe("Deprecated");
  });

  it("renders the farm icon", () => {
    const wrapper = shallowMount(FarmItem, {
      propsData: {
        farm,
      },
    });

    expect(wrapper.findComponent(TokenChainIcon).props("icon")).toBe(farm.icon);
  });
});
