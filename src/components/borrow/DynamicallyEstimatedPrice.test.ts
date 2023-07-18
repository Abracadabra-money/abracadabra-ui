import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import { ethers } from "ethers";
import DynamicallyEstimatedPrice from "@/components/borrow/DynamicallyEstimatedPrice.vue";
import ethConfig from "@/utils/cauldronsConfig/ethereumCauldrons";
import filters from "@/filters/index.js";

import { useImage } from "@/helpers/useImage";

const defaultCauldronParams = {
  mainParams: {
    borrowFee: 1,
    interest: 1,
    liquidationFee: 1,
    collateralPrice: ethers.utils.parseUnits("1000000", 3),
    mimLeftToBorrow: ethers.utils.parseUnits("1000000", 3),
    maximumCollateralRatio: ethers.utils.parseUnits("1000000", 3),
    oracleExchangeRate: ethers.utils.parseUnits("1000000", 3),
    totalBorrowed: ethers.utils.parseUnits("1000000", 3),
    tvl: ethers.utils.parseUnits("1000000", 3),
    userMaxBorrow: ethers.utils.parseUnits("1000000", 3),
  },
  userPosition: {
    collateralInfo: {
      userCollateralShare: ethers.utils.parseUnits("1000000", 3),
      userCollateralAmount: ethers.utils.parseUnits("1000000", 3),
    },
    borrowInfo: {
      userBorrowPart: ethers.utils.parseUnits("1000000", 3),
      userBorrowAmount: ethers.utils.parseUnits("1000000", 3),
    },
    oracleRate: ethers.utils.parseUnits("1000000", 3),
    liquidationPrice: "100",
  },
  userTokensInfo: {
    collateralBalance: ethers.utils.parseUnits("1000000", 3),
    mimBalance: ethers.utils.parseUnits("1000000", 3),
    nativeTokenBalance: ethers.utils.parseUnits("1000000", 3),
    collateralAllowance: ethers.utils.parseUnits("1000000", 3),
    mimAllowance: ethers.utils.parseUnits("1000000", 3),
    unwrappedTokenBalance: ethers.utils.parseUnits("1000000", 3),
    unwrappedTokenAllowance: ethers.utils.parseUnits("1000000", 3),
  },
};

const testProvider = await ethers.getDefaultProvider();

const testEthCauldron = {
  config: ethConfig[30],
  contracts: {
    collateral: new ethers.Contract(
      ethConfig[30].collateralInfo.address,
      ethConfig[30].collateralInfo.abi,
      testProvider
    ),
  },
  ...defaultCauldronParams,
};

describe("DynamicallyEstimatedPrice.vue", async () => {
  const tooltip = vi.fn();

  it("Should render in default situation", () => {
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

    const wrapper: any = mount(DynamicallyEstimatedPrice, {
      props: { mimAddress: testEthCauldron.config.mimInfo.address, amount: 10 },
      global: {
        plugins: [store],
        directives: { tooltip },
      },
    });

    const dynamicallyEstimatedPrice = wrapper.find(".dynamical-price-block");
    expect(dynamicallyEstimatedPrice.exists()).toBe(true);
  });

  it("Should render and calculate computed properties if amount has not been passed", () => {
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

    const wrapper: any = mount(DynamicallyEstimatedPrice, {
      props: { mimAddress: testEthCauldron.config.mimInfo.address },
      global: {
        plugins: [store],
        directives: { tooltip },
      },
    });

    expect(wrapper.vm.estimationResult).toBe("~");
    expect(wrapper.vm.estimateAmount).toBe(false);
    expect(wrapper.vm.parsedAmount).toBe(false);
    expect(wrapper.vm.estimatePercent).toBe(false);
    expect(wrapper.vm.estimationResultTextColor).toBe("");
  });

  it("Should render and calculate computed properties if isClosed === true", () => {
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

    const wrapper: any = mount(DynamicallyEstimatedPrice, {
      props: {
        mimAddress: testEthCauldron.config.mimInfo.address,
        isClose: true,
        amount: 10,
        slippage: 10000000,
      },
      global: {
        plugins: [store],
        directives: { tooltip },
      },
    });

    expect(wrapper.vm.estimationDescription).toBe("Dynamic Closing Fee");
    expect(wrapper.vm.buyToken).toBe(
      "0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3"
    );
    expect(wrapper.vm.sellToken).toBe(
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    );
    expect(wrapper.vm.isProfit).toBe(false);
  });

  it("Should render and calculate computed properties if isClosed === false", () => {
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

    const wrapper: any = mount(DynamicallyEstimatedPrice, {
      props: {
        mimAddress: testEthCauldron.config.mimInfo.address,
        amount: 10,
        slippage: 10,
      },
      global: {
        plugins: [store],
        directives: { tooltip },
      },
    });

    expect(wrapper.vm.estimationDescription).toBe("Dynamic Opening Fee");
    expect(wrapper.vm.buyToken).toBe(
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    );
    expect(wrapper.vm.sellToken).toBe(
      "0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3"
    );
    expect(wrapper.vm.isProfit).toBe(false);
  });

  it("Should render and calculate computed properties if amount and slippage has been passed", () => {
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

    const wrapper: any = mount(DynamicallyEstimatedPrice, {
      props: {
        mimAddress: testEthCauldron.config.mimInfo.address,
        amount: 10,
        slippage: 50,
      },
      global: {
        plugins: [store],
        directives: { tooltip },
      },
    });

    expect(wrapper.vm.estimationResult).toBe("~");
    expect(wrapper.vm.estimateAmount).toBe(false);
    expect(wrapper.vm.parsedAmount).toStrictEqual(
      ethers.utils.parseUnits(filters.formatToFixed(10, 18))
    );
    expect(wrapper.vm.estimatePercent).toBe(false);
    expect(wrapper.vm.estimationResultTextColor).toBe("");
  });
});
