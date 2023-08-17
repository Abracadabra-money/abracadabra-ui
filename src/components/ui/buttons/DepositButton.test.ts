import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import DepositButton from "@/components/ui/buttons/DepositButton.vue";
import ethConfig from "@/utils/cauldronsConfig/ethereumCauldrons";
import avaxConfig from "@/utils/cauldronsConfig/avalancheCauldrons";

import { ethers } from "ethers";

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
  config: ethConfig[16],
  contracts: {
    collateral: new ethers.Contract(
      ethConfig[16].collateralInfo.address,
      ethConfig[16].collateralInfo.abi,
      testProvider
    ),
  },
  ...defaultCauldronParams,
};

const testAvaxCauldron = {
  config: avaxConfig[1],
  contracts: {
    collateral: new ethers.Contract(
      avaxConfig[1].collateralInfo.address,
      avaxConfig[1].collateralInfo.abi,
      testProvider
    ),
  },
  ...defaultCauldronParams,
};

const storeEth = new Vuex.Store({
  modules: {
    connectProvider: {
      state: { account: "0x0testAcc", chainId: 1 },
      getters: {
        getAccount: (state) => state.account,
        getChainId: (state) => state.chainId,
      },
      mutations: {
        setPopupState: () => null,
      },
    },
  },
});

const storeAvalanche = new Vuex.Store({
  modules: {
    connectProvider: {
      state: { account: "0x0testAcc", chainId: 43114 },
      getters: {
        getAccount: (state) => state.account,
        getChainId: (state) => state.chainId,
      },
      mutations: {
        setPopupState: () => null,
      },
    },
  },
});

describe("DepositButton.vue basics", () => {
  const storeAccountNull = new Vuex.Store({
    modules: {
      connectProvider: {
        state: { account: null, chainId: 1 },
        getters: {
          getAccount: (state) => state.account,
          getChainId: (state) => state.chainId,
        },
      },
    },
  });

  const wrapper: any = mount(DepositButton, {
    props: { cauldron: testEthCauldron },
    global: { plugins: [storeEth] },
  });

  const wrapperAccountNull: any = mount(DepositButton, {
    props: { cauldron: testEthCauldron },
    global: { plugins: [storeAccountNull] },
  });

  it("Should render if account has been provided", () => {
    const depositBtn = wrapper.find(".deposit-btn");
    expect(depositBtn.exists()).toBe(true);
  });

  it("Should not render if account has not been provided", () => {
    const depositBtn = wrapperAccountNull.find(".deposit-btn");
    expect(depositBtn.exists()).toBe(false);
  });

  it("Should work onClick", async () => {
    const spy = vi.spyOn(wrapper.vm, "openCollateralPopup");

    const depositButton = wrapper.find(".deposit-btn");
    depositButton.trigger("click");
    expect(spy).toHaveBeenCalled();
  });
});

describe("DepositButton.vue specific cauldrons", () => {
  it("Should render 'WRAP' ", () => {
    const wrapperAvax: any = mount(DepositButton, {
      props: { cauldron: testAvaxCauldron },
      global: { plugins: [storeAvalanche] },
    });

    const depositBtn = wrapperAvax.find(".deposit-btn");
    expect(depositBtn.text()).toContain("WRAP");
  });

  it("Should render 'Deposit'", () => {
    const wrapperEth: any = mount(DepositButton, {
      props: { cauldron: testEthCauldron },
      global: { plugins: [storeEth] },
    });
    const depositBtn = wrapperEth.find(".deposit-btn");
    expect(depositBtn.text()).toContain("Deposit");
  });
});
