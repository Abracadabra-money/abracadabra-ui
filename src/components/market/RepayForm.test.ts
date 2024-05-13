import { utils } from "ethers";
import { testStore } from "@/test/store";
import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { actionConfig } from "@/test/actionConfig";
import { magicGlpConfig } from "@/test/magicGlpConfig";
import RepayForm from "@/components/market/RepayForm.vue";

describe("RepayForm", () => {
  it("renders correctly", () => {
    const wrapper = shallowMount(RepayForm, {
      global: {
        plugins: [testStore],
      },
      props: {
        actionConfig,
        cauldron: magicGlpConfig,
      },

      computed: {
        cookValidationData() {
          return { isAllowed: true };
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("emits 'updateToggle' event when onToggleDeleverage is called", () => {
    const wrapper = shallowMount(RepayForm, {
      global: {
        plugins: [testStore],
      },
      props: {
        actionConfig,
        cauldron: magicGlpConfig,
      },
      computed: {
        cookValidationData() {
          return { isAllowed: true };
        },
      },
    });

    wrapper.vm.onToggleDeleverage();

    expect(wrapper.emitted("updateToggle")).toBeTruthy();
    expect(wrapper.emitted("updateToggle")?.[0]).toEqual([
      "useDeleverage",
      true,
    ]);
  });

  it("emits 'updateAmounts' event when onUpdateWithdrawAmount is called", () => {
    const wrapper = shallowMount(RepayForm, {
      global: {
        plugins: [testStore],
      },
      props: {
        actionConfig,
        cauldron: magicGlpConfig,
      },
      computed: {
        cookValidationData() {
          return { isAllowed: true };
        },
      },
    });

    const amount = utils.parseUnits("100", 18);
    wrapper.vm.onUpdateWithdrawAmount(amount);

    expect(wrapper.emitted("updateAmounts")).toBeTruthy();
    expect(wrapper.emitted("updateAmounts")?.[0]).toEqual([
      "withdrawAmount",
      amount,
    ]);
  });

  it("emits 'updateToggle' event when onToggleLeverage is called", () => {
    const wrapper = shallowMount(RepayForm, {
      global: {
        plugins: [testStore],
      },
      props: {
        actionConfig,
        cauldron: magicGlpConfig,
      },
      computed: {
        cookValidationData() {
          return { isAllowed: true };
        },
      },
    });

    wrapper.vm.onToggleDeleverage();

    expect(wrapper.emitted("updateToggle")).toBeTruthy();
    expect(wrapper.emitted("updateToggle")?.[0]).toEqual([
      "useDeleverage",
      true,
    ]);
  });

  it("emits 'updateAmounts' event when onUpdateBorrowAmount is called", () => {
    const wrapper = shallowMount(RepayForm, {
      global: {
        plugins: [testStore],
      },
      props: {
        actionConfig,
        cauldron: magicGlpConfig,
      },
      computed: {
        cookValidationData() {
          return { isAllowed: true };
        },
      },
    });

    const amount = utils.parseUnits("200", 18);

    wrapper.vm.onUpdateRepayAmount(amount);

    expect(wrapper.emitted("updateAmounts")).toBeTruthy();
    expect(wrapper.emitted("updateAmounts")?.[0]).toEqual([
      "repayAmount",
      amount,
    ]);
  });

  it("emits 'updateAmounts' event when onUpdateRepayAmount is called", () => {
    const wrapper = shallowMount(RepayForm, {
      global: {
        plugins: [testStore],
      },
      props: {
        actionConfig,
        cauldron: magicGlpConfig,
      },
      computed: {
        cookValidationData() {
          return { isAllowed: true };
        },
      },
    });

    const amount = utils.parseUnits("50", 18);
    wrapper.vm.onUpdateRepayAmount(amount);

    expect(wrapper.emitted("updateAmounts")).toBeTruthy();
    expect(wrapper.emitted("updateAmounts")?.[0]).toEqual([
      "repayAmount",
      amount,
    ]);
  });
});
