import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import { ethers } from "ethers";
import BalanceBlock from "@/components/borrow/BalanceBlockNew.vue";
import ethConfig from "@/utils/cauldronsConfig/ethereumCauldrons";
import arbConfig from "@/utils/cauldronsConfig/arbitrumCauldrons";

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

const testArbCauldronHiddenWrap = {
  config: arbConfig[1],
  contracts: {
    collateral: new ethers.Contract(
      ethConfig[1].collateralInfo.address,
      ethConfig[1].collateralInfo.abi,
      testProvider
    ),
  },
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

const testArbCauldronAcceptUseDefaultBalance = {
  config: arbConfig[0],
  contracts: {
    collateral: new ethers.Contract(
      ethConfig[0].collateralInfo.address,
      ethConfig[0].collateralInfo.abi,
      testProvider
    ),
  },
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

describe("BalanceBlockNew.vue", async () => {
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

    const wrapper: any = mount(BalanceBlock, {
      props: { cauldron: testEthCauldron },
      global: { plugins: [store] },
    });

    const balanceBlock = wrapper.find(".balance-block");
    expect(balanceBlock.exists()).toBe(true);
  });

  it("Should should calculate computed properties correct", () => {
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

    const wrapper: any = mount(BalanceBlock, {
      props: { cauldron: testEthCauldron },
      global: { plugins: [store] },
    });

    expect(wrapper.vm.nativeTokenInfo).toBeNull();
    expect(wrapper.vm.mimInfo.name).toBe("MIM");
    expect(wrapper.vm.collateralTokenInfo.name).toBe("magicAPE");
    expect(wrapper.vm.unwrappedTokenInfo.name).toBe("APE");
  });

  it("Should render token descriptions and balances correct for token without HiddenWrap", () => {
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

    const wrapper: any = mount(BalanceBlock, {
      props: { cauldron: testEthCauldron },
      global: { plugins: [store] },
    });

    const tokenDescriptions = wrapper.findAll(".token-description");

    expect(tokenDescriptions[0].text()).toBe("MIM");
    expect(tokenDescriptions[1].text()).toBe("magicAPE");
    expect(tokenDescriptions[2].text()).toBe("APE");

    const tokenBalances = wrapper.findAll(".token-balance");
    expect(tokenBalances[0].text()).toBe("0...1");
    expect(tokenBalances[1].text()).toBe("0...1$ 1");
    expect(tokenBalances[2].text()).toBe("0...1$ 1");
  });

  it("Should render token descriptions and balances correct for token with HiddenWrap", () => {
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

    const wrapper: any = mount(BalanceBlock, {
      props: { cauldron: testArbCauldronHiddenWrap },
      global: { plugins: [store] },
    });

    const tokenDescriptions = wrapper.findAll(".token-description");
    expect(tokenDescriptions[0].text()).toBe("MIM");
    expect(tokenDescriptions[1].text()).toBe("abra-wsGlp");

    const tokenBalances = wrapper.findAll(".token-balance");
    expect(tokenBalances[0].text()).toBe("0...1");
    expect(tokenBalances[1].text()).toBe("0...1$ 1");
  });

  it("Should render token descriptions and balances correct for token with acceptUseDefaultBalance", () => {
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

    const wrapper: any = mount(BalanceBlock, {
      props: { cauldron: testArbCauldronAcceptUseDefaultBalance },
      global: { plugins: [store] },
    });

    const tokenDescriptions = wrapper.findAll(".token-description");
    expect(tokenDescriptions[0].text()).toBe("ETH");
    expect(tokenDescriptions[1].text()).toBe("MIM");
    expect(tokenDescriptions[2].text()).toBe("WETH");

    const tokenBalances = wrapper.findAll(".token-balance");
    expect(tokenBalances[0].text()).toBe("0...1");
    expect(tokenBalances[1].text()).toBe("0...1");
    expect(tokenBalances[2].text()).toBe("0...1$ 1");
  });
});
