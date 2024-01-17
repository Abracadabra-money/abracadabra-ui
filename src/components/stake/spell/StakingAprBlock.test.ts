import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import StakingAprBlock from "@/components/stake/spell/StakingAprBlock.vue";

describe("StakingAprBlock", () => {
  it("renders the component with the correct props", () => {
    const apr = 5;
    const wrapper = shallowMount(StakingAprBlock, {
      propsData: {
        apr,
      },
    });

    expect(wrapper.find(".staking-apr").exists()).toBe(true);
    expect(wrapper.find(".mim-icon").exists()).toBe(true);
    expect(wrapper.find(".title").exists()).toBe(true);
    expect(wrapper.find(".value").exists()).toBe(true);
    expect(wrapper.find(".value").text()).toBe(`5%`);
  });
});
