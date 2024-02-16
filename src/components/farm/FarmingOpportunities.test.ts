import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import FarmingOpportunities from "@/components/farm/FarmingOpportunities.vue";

describe("FarmingOpportunities", () => {
  it("renders the component", () => {
    const wrapper = shallowMount(FarmingOpportunities, {
      propsData: {
        selectedFarm: {
          farmRoi: 0.1,
          farmTvl: 1000000,
          stakingToken: {
            link: "https://example.com",
          },
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("displays the APR value", () => {
    const wrapper = shallowMount(FarmingOpportunities, {
      propsData: {
        selectedFarm: {
          farmRoi: 0.1,
          farmTvl: 1000000,
          stakingToken: {
            link: "https://example.com",
          },
        },
      },
    });

    const aprValue = wrapper.find(".value");
    expect(aprValue.text()).toBe("0.1%");
  });

  it("displays the TVL value", () => {
    const wrapper = shallowMount(FarmingOpportunities, {
      propsData: {
        selectedFarm: {
          farmRoi: 0.1,
          farmTvl: 1000000,
          stakingToken: {
            link: "https://example.com",
          },
        },
      },
    });

    const tvlValue = wrapper.findAll(".value");
    expect(tvlValue[1].text()).toBe("$ 1,000,000");
  });
});
