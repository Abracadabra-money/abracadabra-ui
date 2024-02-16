import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import BaseTokenInput from "@/components/base/BaseTokenInput.vue";

const tooltip = vi.fn();

describe("BaseTokenInput", () => {
  it("renders the component", () => {
    const wrapper = shallowMount(BaseTokenInput, { directives: { tooltip } });
    expect(wrapper.exists()).toBe(true);
  });

  it("sets the inputValue correctly when value prop is provided", () => {
    const value = 100;
    const wrapper = shallowMount(BaseTokenInput, {
      props: {
        value,
      },
      directives: { tooltip },
    });
    expect(wrapper.vm.inputValue).toBe(value);
  });

  it("formats the tokenName correctly when name prop is provided", () => {
    const name = "Test Token";
    const wrapper = shallowMount(BaseTokenInput, {
      props: {
        name,
      },
      directives: { tooltip },
    });
    expect(wrapper.vm.tokenName).toBe(name);
  });

  it("formats the max value correctly when isBigNumber prop is true", () => {
    const max = 1000000000000000000n;
    const decimals = 18;
    const isBigNumber = true;
    const wrapper = shallowMount(BaseTokenInput, {
      props: {
        max,
        decimals,
        isBigNumber,
      },
      directives: { tooltip },
    });
    const formattedMax = wrapper.vm.formattedMax;
    expect(formattedMax).toBe("1.0");
  });

  it("formats the max value correctly when isBigNumber prop is false", () => {
    const max = 1000000000000000000n;
    const decimals = 18;
    const isBigNumber = false;
    const wrapper = shallowMount(BaseTokenInput, {
      props: {
        max,
        decimals,
        isBigNumber,
      },
      directives: { tooltip },
    });
    const formattedMax = wrapper.vm.formattedMax;
    expect(formattedMax).toBe("1");
  });

  it("calculates the USD equivalent correctly when tokenPrice is provided", () => {
    const value = 10;
    const tokenPrice = 100;
    const wrapper = shallowMount(BaseTokenInput, {
      props: {
        value,
        tokenPrice,
      },
      directives: { tooltip },
    });
    const usdEquivalent = wrapper.vm.usdEquivalent;
    expect(usdEquivalent).toBe("$ 1,000");
  });
});
