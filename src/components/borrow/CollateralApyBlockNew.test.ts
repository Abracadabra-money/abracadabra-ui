import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import { ethers } from "ethers";
import CollateralApyBlock from "@/components/borrow/CollateralApyBlockNew.vue";
import ethConfig from "@/utils/cauldronsConfig/ethereumCauldrons";
import arbConfig from "@/utils/cauldronsConfig/arbitrumCauldrons";
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

const testArbCauldronHiddenWrap = {
  config: arbConfig[1],
  contracts: {
    collateral: new ethers.Contract(
      ethConfig[1].collateralInfo.address,
      ethConfig[1].collateralInfo.abi,
      testProvider
    ),
  },
  ...defaultCauldronParams,
};

const testArbCauldronAcceptUseDefaultBalance = {
  config: arbConfig[0],
  contracts: {
    collateral: new ethers.Contract(
      ethConfig[0].collateralInfo.address,
      ethConfig[0].collateralInfo.abi,
      testProvider
    ),
  },
  ...defaultCauldronParams,
};

describe("CollateralApyBlock.vue", async () => {
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

    const wrapper: any = mount(CollateralApyBlock, {
      props: { cauldron: testEthCauldron },
      global: { plugins: [store] },
    });

    const collateralApyBlock = wrapper.find(".apy-wrap");
    expect(collateralApyBlock.exists()).toBe(true);
  });

  it("Should render not-exist-apy, if it is not exist", () => {
    const store = new Vuex.Store({
      modules: {
        connectProvider: {
          state: { chainId: null },
          getters: {
            getChainId: (state) => state.chainId,
          },
        },
      },
    });

    const wrapper: any = mount(CollateralApyBlock, {
      props: { cauldron: testEthCauldron },
      global: { plugins: [store] },
    });

    const notExistApy = wrapper.find(".apy-is-not-exist");
    expect(notExistApy.exists()).toBe(true);
  });

  it("Should render and calculate apyInfo correct", () => {
    const apeStore = new Vuex.Store({
      modules: {
        connectProvider: {
          state: { chainId: 1 },
          getters: {
            getChainId: (state) => state.chainId,
          },
        },
      },
    });

    const apeWrapper: any = mount(CollateralApyBlock, {
      props: { cauldron: testEthCauldron },
      global: { plugins: [apeStore] },
    });

    expect(apeWrapper.vm.isApe).toBe(true);
    expect(apeWrapper.vm.apyInfo).toEqual({
      bg: useImage("assets/images/ape/apy-bg.png"),
      coins: useImage("assets/images/ape/coins-ape.png"),
    });

    const store = new Vuex.Store({
      modules: {
        connectProvider: {
          state: { chainId: 42161 },
          getters: {
            getChainId: (state) => state.chainId,
          },
        },
      },
    });

    const wrapper: any = mount(CollateralApyBlock, {
      props: { cauldron: testEthCauldron },
      global: { plugins: [store] },
    });

    expect(wrapper.vm.isApe).toBe(false);
    expect(wrapper.vm.apyInfo).toEqual({
      bg: useImage("assets/images/primary-apy-bg.png"),
      coins: useImage("assets/images/coins.png"),
    });
  });

  it("Should calculate collateralApy correct", () => {
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

    const wrapper: any = mount(CollateralApyBlock, {
      props: { expectedLeverage: 10, cauldron: testEthCauldron },
      global: { plugins: [store] },
    });

    expect(wrapper.vm.isTilde).toBe("");
    expect(wrapper.vm.collateralApy).toBe(null);
  });
});
