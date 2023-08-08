import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import { describe, expect, it } from "vitest";
import { ethers } from "ethers";

import BentoBoxBlock from "@/components/myPositions/BentoBoxBlock.vue";

const testBentoBalance = ethers.utils.parseUnits("10000000000000000", 3);
const testDegenBalance = ethers.utils.parseUnits("20000000000000000", 3);

describe("BentoBoxBlock.vue", () => {
  it("Should computing correct with all getters passed", () => {
    const store = new Vuex.Store({
      modules: {
        connectProvider: {
          state: {
            account: "0x",
          },
          getters: {
            getAccount: (state) => state.account,
          },
        },
        stake: {
          state: {
            mimInBentoDepositObject: {
              mimInBentoBalance: testBentoBalance,
              mimInDegenBalance: testDegenBalance,
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
    expect(wrapper.vm.isHide).toBe(10000000000000000000);
  });

  it("Should computing correct with not all getters passed", () => {
    const store = new Vuex.Store({
      modules: {
        connectProvider: {
          state: {
            account: undefined,
          },
          getters: {
            getAccount: (state) => state.account,
          },
        },
        stake: {
          state: {
            mimInBentoDepositObject: undefined,
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

    expect(wrapper.vm.account).toBeUndefined();
    expect(wrapper.vm.bentoBoxConfig).toBeUndefined();
    expect(wrapper.vm.isHide).toBeFalsy();
  });
});
