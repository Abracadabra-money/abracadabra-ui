import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import { describe, expect, it } from "vitest";
import CauldronPositionItem from "@/components/myPositions/CauldronPositionItem.vue";
import config from "@/utils/cauldronsConfig/ethereumCauldrons";
import configArb from "@/utils/cauldronsConfig/arbitrumCauldrons";
import { useImage } from "@/helpers/useImage";

import { ethers } from "ethers";

const cauldron = {
  config: config[4],
  oracleRate: 100,
  collateralInfo: {
    userCollateralShare: 1000,
    userCollateralAmount: 1000,
  },
  borrowInfo: {
    userBorrowPart: ethers.utils.parseUnits("1000000", 3),
    userBorrowAmount: ethers.utils.parseUnits("1000000", 3),
  },
  liquidationPrice: 1000,
};
const cauldronArb = {
  config: configArb[0],
  oracleRate: 100,
  collateralInfo: {
    userCollateralShare: 1000,
    userCollateralAmount: 1000,
  },
  borrowInfo: {
    userBorrowPart: ethers.utils.parseUnits("1000000", 3),
    userBorrowAmount: ethers.utils.parseUnits("1000000", 3),
  },
  liquidationPrice: 1000,
};

describe("CauldronPositionItem.vue", () => {
  it("Should render in default situation, when passed only cauldron", () => {
    const store = new Vuex.Store({
      modules: {
        connectProvider: {
          state: { chainId: 1 },
          getters: {
            getChainId: (state) => state.chainId,
          },
        },
      },
    });

    const wrapper: any = mount(CauldronPositionItem, {
      props: { cauldron },
      global: { plugins: [store] },
    });

    const positionHealth = wrapper.find(".position-health");
    expect(positionHealth.exists()).toBe(true);
  });

  it("Should not render '.position-health' if opened === false", () => {
    const store = new Vuex.Store({
      modules: {
        connectProvider: {
          state: { chainId: 1 },
          getters: {
            getChainId: (state) => state.chainId,
          },
        },
      },
    });

    const wrapper: any = mount(CauldronPositionItem, {
      props: { opened: false, cauldron },
      global: { plugins: [store] },
    });

    const positionHealth = wrapper.find(".position-health");
    expect(positionHealth.exists()).toBe(false);
  });

  it("Should compute collateralSymbol correct", () => {
    const store = new Vuex.Store({
      modules: {
        connectProvider: {
          state: { chainId: 1 },
          getters: {
            getChainId: (state) => state.chainId,
          },
        },
      },
    });

    const wrapper: any = mount(CauldronPositionItem, {
      props: { cauldron },
      global: { plugins: [store] },
    });

    expect(wrapper.vm.collateralSymbol).toBe("sSPELL");

    const storeArb = new Vuex.Store({
      modules: {
        connectProvider: {
          state: { chainId: 42161 },
          getters: {
            getChainId: (state) => state.chainId,
          },
        },
      },
    });

    const wrapperArb: any = mount(CauldronPositionItem, {
      props: { cauldron: cauldronArb },
      global: { plugins: [storeArb] },
    });

    expect(wrapperArb.vm.collateralSymbol).toBe("WETH");
  });

  it("Should extract info from props to computed properties properly", () => {
    const store = new Vuex.Store({
      modules: {
        connectProvider: {
          state: { chainId: 1 },
          getters: {
            getChainId: (state) => state.chainId,
          },
        },
      },
    });

    const wrapper: any = mount(CauldronPositionItem, {
      props: { cauldron },
      global: { plugins: [store] },
    });

    expect(wrapper.vm.oracleRate).toBe("0.0000000000000001");
    expect(wrapper.vm.collateralPrice).toBe(10000000000000000);
    expect(wrapper.vm.userCollateralAmount).toBe("0.000000000000001");
    expect(wrapper.vm.userCollateralAmountUsd).toBe(10.000000000000002);
    expect(wrapper.vm.userBorrowAmount).toBe("0.000000001");
    expect(wrapper.vm.positionActions[2]).toContain({
      icon: useImage("assets/images/myposition/Deleverage.png"),
      id: 11,
      name: "DeleverageId",
    });
    expect(wrapper.vm.assetsInfo[0]).toEqual({
      amount: "0...1",
      amountUsd: "$ 10",
      icon: useImage("assets/images/tokens/sSPELL.png"),
      symbol: "sSPELL",
      title: "Collateral Deposited",
    });
  });

  it("Should have correct computed properties depends on passed props", () => {
    const store = new Vuex.Store({
      modules: {
        connectProvider: {
          state: { chainId: 1 },
          getters: {
            getChainId: (state) => state.chainId,
          },
        },
      },
    });

    const wrapper: any = mount(CauldronPositionItem, {
      props: {
        cauldron,
      },
      global: { plugins: [store] },
    });

    expect(wrapper.vm.positionHealth).toBe("100.00");
    expect(wrapper.vm.positionRisk).toBe("safe");
  });
});
