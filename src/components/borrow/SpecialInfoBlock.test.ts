import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import { ethers } from "ethers";
import SpecialInfoBlock from "@/components/borrow/SpecialInfoBlock.vue";
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

const testEthCauldron = {
  config: ethConfig[30],
  ...defaultCauldronParams,
};

const testMigratedCauldron = {
  config: ethConfig[28],
  ...defaultCauldronParams,
};

const testTokenLinkCauldron = {
  config: ethConfig[29],
  ...defaultCauldronParams,
};

const store = new Vuex.Store({
  modules: {
    connectProvider: {
      state: { chainId: 1, account: "0x0" },
      getters: {
        getChainId: (state) => state.chainId,
        getAccount: (state) => state.account,
      },
    },
  },
});

describe("SpecialInfoBlock.vue", async () => {
  it("Should render and calculate computed properties correct in default situation", () => {
    const wrapper: any = mount(SpecialInfoBlock, {
      props: { cauldron: testEthCauldron },
      global: { plugins: [store] },
    });

    const tagsWrap = wrapper.find(".tags-wrap");
    expect(tagsWrap.exists()).toBe(true);

    expect(wrapper.vm.isLockedTimer).toBe(0);
    expect(wrapper.vm.isLeverageTag).toBe(true);
    expect(wrapper.vm.isMigrated).toBe(false);
    expect(wrapper.vm.tokenLinkData).toBeUndefined();
  });

  it("Should calculate correct isMigrated cauldron", () => {
    const wrapper: any = mount(SpecialInfoBlock, {
      props: { cauldron: testMigratedCauldron },
      global: { plugins: [store] },
    });

    expect(wrapper.vm.isLockedTimer).toBe(0);
    expect(wrapper.vm.isLeverageTag).toBe(false);
    expect(wrapper.vm.isMigrated).toBe(true);
    expect(wrapper.vm.tokenLinkData).toBeUndefined();
  });

  it("Should have proper linkData on specific cauldron", () => {
    const wrapper: any = mount(SpecialInfoBlock, {
      props: { cauldron: testTokenLinkCauldron },
      global: { plugins: [store] },
    });

    expect(wrapper.vm.tokenLinkData).toMatchObject({
      id: 38,
      chain: 1,
      href: "https://yearn.finance/vaults/1/0x8078198Fc424986ae89Ce4a910Fc109587b6aBF3",
      label: "Get Yearn Tokens",
    });
  });
});
