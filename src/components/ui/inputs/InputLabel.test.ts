import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import InputLabel from "@/components/ui/inputs/InputLabel.vue";

describe("InputLabel", () => {
  it("renders the title correctly", () => {
    const title = "Collateral assets";
    const wrapper = shallowMount(InputLabel, {
      propsData: {
        title,
      },
    });

    expect(wrapper.find("h4").text()).toBe(title);
  });

  it("renders the formatted token balance when showBalance is true", () => {
    const amount = 100;
    const formattedAmount = "100";
    const wrapper = shallowMount(InputLabel, {
      propsData: {
        amount,
      },
    });

    expect(wrapper.find(".amount").text()).toBe(`Balance: ${formattedAmount}`);
  });

  it("does not render the formatted token balance when showBalance is false", () => {
    const amount = 100;
    const wrapper = shallowMount(InputLabel, {
      propsData: {
        amount,
        showBalance: false,
      },
    });

    expect(wrapper.find(".amount").exists()).toBe(false);
  });
});
