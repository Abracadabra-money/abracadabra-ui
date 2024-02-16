import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import FarmItem from "@/components/farm/FarmItem.vue";
import TokenChainIcon from "@/components/ui/icons/TokenChainIcon.vue";

describe("FarmItem", () => {
  it("renders the farm name", () => {
    const farm = {
      name: "Farm A",
      // other farm properties
    };
    const wrapper = shallowMount(FarmItem, {
      propsData: {
        farm,
      },
    });

    expect(wrapper.find(".token-name").text()).toBe(farm.name);
  });

  it("renders the APR value", () => {
    const farm = {
      farmRoi: 0.05,
    };
    const wrapper = shallowMount(FarmItem, {
      propsData: {
        farm,
      },
    });

    expect(wrapper.find(".tag-value").text()).toBe("0.05%");
  });

  it("renders the TVL value", () => {
    const farm = {
      farmTvl: 1000000,
    };
    const wrapper = shallowMount(FarmItem, {
      propsData: {
        farm,
      },
    });

    expect(wrapper.findAll(".tag-value")[1].text()).toBe("$ 1,000,000");
  });

  it("renders the farm status flag", () => {
    const farm = {
      isDeprecated: true,
      // other farm properties
    };
    const wrapper = shallowMount(FarmItem, {
      propsData: {
        farm,
      },
    });

    expect(wrapper.find(".status-flag-text").text()).toBe("Deprecated");
  });

  it("renders the farm icon", () => {
    const farm = {
      icon: "farm-icon",
      // other farm properties
    };
    const wrapper = shallowMount(FarmItem, {
      propsData: {
        farm,
      },
    });

    expect(wrapper.findComponent(TokenChainIcon).props("icon")).toBe(farm.icon);
  });
});
