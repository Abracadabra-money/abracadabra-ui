import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import { ethers } from "ethers";
import ExecutionPrice from "@/components/borrow/ExecutionPrice.vue";
import ethConfig from "@/utils/cauldronsConfig/ethereumCauldrons";

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
  config: ethConfig[25],
  contracts: {
    collateral: new ethers.Contract(
      ethConfig[25].collateralInfo.address,
      ethConfig[25].collateralInfo.abi,
      testProvider
    ),
  },
  ...defaultCauldronParams,
};

describe("ExecutionPrice.vue", async () => {
  const tooltip = vi.fn();

  const store = new Vuex.Store({
    modules: {
      connectProvider: {
        state: { chainId: 1, provider: testProvider },
        getters: {
          getChainId: (state) => state.chainId,
        },
      },
    },
  });

  const wrapper: any = mount(ExecutionPrice, {
    props: {
      cauldron: testEthCauldron,
      slippage: 0,
      maxBorrowValue: 0,
      collateralValue: 0,
      multiplier: 0,
    },
    global: { plugins: [store], directives: { tooltip } },
  });

  it("Should render in default situation", () => {
    const executionPrice = wrapper.find(".execution-price");
    expect(executionPrice.exists()).toBe(true);
    expect(wrapper.vm.tooltipText).toContain("LUSD");
  });

  describe("Computed properties in different cases", () => {
    it("Should calculate executionPrice correct", async () => {
      await wrapper.setData({ isFetching: true });
      expect(wrapper.vm.executionPrice).toBe("Fetching...");

      await wrapper.setData({ isFetching: false, price: null });
      expect(wrapper.vm.executionPrice).toBe("0.0");

      await wrapper.setData({ price: 0.1 });
      expect(wrapper.vm.executionPrice).toBe("10.0");
    });

    it("Should calculate isWarning correct", async () => {
      expect(wrapper.vm.isWarning).toBe(false);

      await wrapper.setData({ isFetching: false, isMoreOnePercent: true });
      expect(wrapper.vm.isWarning).toBe(true);
    });

    it("Should calculate sellAmount  correct", async () => {
      expect(wrapper.vm.sellAmount).toBe("0");
      expect(wrapper.vm.sellAmount).toBeTypeOf("string");

      await wrapper.setProps({ maxBorrowValue: 100, multiplier: 0.5 });
      expect(wrapper.vm.sellAmount).toBe("99500000000000000000");
    });
  });
});
