import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import PercentageButtons from "@/components/borrow/PercentageButtons.vue";

describe("PercentageButtons.vue", async () => {
  const wrapper: any = mount(PercentageButtons, {
    props: {
      maxParcent: 100,
      isDisabled: false,
    },
  });

  it("Should render and all buttons be enabled", () => {
    const percentageButtons = wrapper.findAll(".percent-button");
    percentageButtons.forEach((button: any) => {
      expect(button.classes("disabled")).toBe(false);
    });
  });

  it("Should all buttons be disabled if isDisabled is true or maxParcent less than 25", async () => {
    await wrapper.setProps({ isDisabled: true });
    const percentageButtons = wrapper.findAll(".percent-button");
    const inputCustom = wrapper.find(".custom-input-wrap");

    percentageButtons.forEach((button: any) => {
      expect(button.classes()).toContain("disabled");
    });
    expect(inputCustom.classes()).toContain("disabled");

    await wrapper.setProps({ maxParcent: 10, isDisabled: false });
    percentageButtons.forEach((button: any) => {
      expect(button.classes()).toContain("disabled");
    });
  });

  it("Should calculate customInputClasses correct", async () => {
    expect(wrapper.vm.customInputClasses).toMatchObject({
      active: false,
      disabled: false,
      error: false,
    });

    await wrapper.setProps({ maxParcent: 0, isDisabled: true });
    await wrapper.setData({
      parcentValue: 50,
      isCustomInput: true,
      errorCastomValue: true,
    });
    expect(wrapper.vm.customInputClasses).toMatchObject({
      active: 50,
      disabled: true,
      error: true,
    });
  });

  it("Should activate button", async () => {
    await wrapper.setProps({ maxParcent: 100, isDisabled: false });

    const percentageButton = wrapper.find(".percent-button");
    expect(percentageButton.classes("active")).toBe(false);

    await wrapper.setData({
      parcentValue: 25,
      isCustomInput: false,
      errorCastomValue: true,
    });
    expect(percentageButton.classes()).toContain("active");
  });
});
