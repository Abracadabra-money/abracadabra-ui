import { mount } from "@vue/test-utils";
import { BigNumber, utils } from "ethers";
import { describe, it, expect, vi } from "vitest";
import SlippagePopup from "@/components/popups/SlippagePopup.vue";

const tooltip = vi.fn();
const clickOutside = vi.fn();

describe("SlippagePopup", () => {
  it("renders correctly when showPopup is false", () => {
    const wrapper = mount(SlippagePopup, {
      props: {
        amount: BigNumber.from(100),
        defaultAmount: BigNumber.from(50),
      },
      global: { directives: { tooltip, clickOutside } },
    });

    expect(wrapper.find(".slippage-popup").exists()).toBe(false);
  });

  it("renders correctly when showPopup is true", async () => {
    const wrapper = mount(SlippagePopup, {
      props: {
        amount: BigNumber.from(100),
        defaultAmount: BigNumber.from(50),
      },
      global: { directives: { tooltip, clickOutside } },
    });

    wrapper.setData({ showPopup: true });
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".slippage-popup").exists()).toBe(true);
  });

  it("emits updateSlippage event when inputValue changes", async () => {
    const wrapper = mount(SlippagePopup, {
      props: {
        amount: utils.parseUnits("100"),
        defaultAmount: utils.parseUnits("10"),
      },
      global: { directives: { tooltip, clickOutside } },
    });

    wrapper.setData({ showPopup: true });
    await wrapper.vm.$nextTick();

    const input = wrapper.find(".input");

    await input.setValue("10");

    expect(wrapper.emitted("updateSlippage")).toBeTruthy();
  });

  it("calls getDefaultSlippage method when auto button is clicked", async () => {
    const wrapper = mount(SlippagePopup, {
      props: {
        amount: utils.parseUnits("50"),
        defaultAmount: utils.parseUnits("100"),
      },
      global: { directives: { tooltip, clickOutside } },
    });

    wrapper.setData({ showPopup: true });
    await wrapper.vm.$nextTick();

    const button = wrapper.find(".auto-button");
    await button.trigger("click");

    expect(wrapper.vm.inputValue).toBe(100);
  });
});
