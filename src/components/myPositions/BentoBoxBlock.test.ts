import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import { describe, expect, it } from "vitest";

import BentoBoxBlock from "@/components/myPositions/BentoBoxBlock.vue";

describe("BentoBoxBlock.vue", () => {
  it("computing correct with all getters passed", () => {
    const store = new Vuex.Store({
      modules: {
        connectProvider: {
          state: { account: "0x" },
          getters: {
            getAccount: (state) => state.account,
          },
        },
        stake: {
          state: {
            mimInBentoDepositObject: {
              mimInBentoBalance: 1,
              mimInDegenBalance: 2,
            },
          },
          getters: {
            getMimInBentoDepositObject: (state) =>
              state.mimInBentoDepositObject,
          },
        },
      },
    });

    const wrapper: any = mount(BentoBoxBlock, {
      props: { opened: false, isBento: null, isDeposit: null },
      global: { plugins: [store] },
    });

    expect(wrapper.vm.account).toEqual("0x");
    expect(wrapper.vm.bentoBoxConfig).toBeDefined();
    expect(wrapper.vm.isHide).toBeTruthy();
  });

  it("computing correct with not all getters passed", () => {
    const store = new Vuex.Store({});

    const wrapper: any = mount(BentoBoxBlock, {
      props: { opened: false, isBento: null, isDeposit: null },
      global: { plugins: [store] },
    });

    expect(wrapper.vm.account).toBeUndefined();
    expect(wrapper.vm.bentoBoxConfig).toBeUndefined();
    expect(wrapper.vm.isHide).toBeFalsy();
  });
});
