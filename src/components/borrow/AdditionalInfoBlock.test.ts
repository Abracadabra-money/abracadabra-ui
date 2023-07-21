import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import { ethers } from "ethers";
import AdditionalInfoBlock from "@/components/borrow/AdditionalInfoBlock.vue";
import ethConfig from "@/utils/cauldronsConfig/ethereumCauldrons";

const defaultCauldronParams = {
  mainParams: {
    borrowFee: 1,
    interest: 1,
    liquidationFee: 1,
    collateralPrice: ethers.utils.parseUnits("1000000000000000000", 3),
    mimLeftToBorrow: ethers.utils.parseUnits("1000000000000000000", 3),
    maximumCollateralRatio: ethers.utils.parseUnits("1000000000000000000", 3),
    oracleExchangeRate: ethers.utils.parseUnits("1000000000000000000", 3),
    totalBorrowed: ethers.utils.parseUnits("1000000000000000000", 3),
    tvl: ethers.utils.parseUnits("1000000000000000000", 3),
    userMaxBorrow: ethers.utils.parseUnits("1000000000000000000", 3),
  },
  userPosition: {
    collateralInfo: {
      userCollateralShare: ethers.utils.parseUnits("1000000000000000000", 3),
      userCollateralAmount: ethers.utils.parseUnits(
        "1000000000000000000000",
        3
      ),
    },
    borrowInfo: {
      userBorrowPart: ethers.utils.parseUnits("1000000000000000000", 3),
      userBorrowAmount: ethers.utils.parseUnits("1000000000000000000", 3),
    },
    oracleRate: ethers.utils.parseUnits("1000000000000000000", 3),
    liquidationPrice: "100",
  },
  userTokensInfo: {
    collateralBalance: ethers.utils.parseUnits("1000000000000000000", 3),
    mimBalance: ethers.utils.parseUnits("1000000000000000000", 3),
    nativeTokenBalance: ethers.utils.parseUnits("1000000000000000000", 3),
    collateralAllowance: ethers.utils.parseUnits("1000000000000000000", 3),
    mimAllowance: ethers.utils.parseUnits("1000000000000000000", 3),
    unwrappedTokenBalance: ethers.utils.parseUnits("1000000000000000000", 3),
    unwrappedTokenAllowance: ethers.utils.parseUnits("1000000000000000000", 3),
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

const testWhitelistedCauldron = {
  config: ethConfig[30],
  additionalInfo: {
    whitelistedInfo: {
      isUserWhitelisted: true,
      userBorrowPart: ethers.utils.parseUnits("1000000000000000000", 3),
    },
  },
  contracts: {
    collateral: new ethers.Contract(
      ethConfig[30].collateralInfo.address,
      ethConfig[30].collateralInfo.abi,
      testProvider
    ),
  },
  ...defaultCauldronParams,
};

const testCauldronWithMaxBorrow = {
  config: ethConfig[30],
  contracts: {
    collateral: new ethers.Contract(
      ethConfig[30].collateralInfo.address,
      ethConfig[30].collateralInfo.abi,
      testProvider
    ),
  },
  ...defaultCauldronParams,
  ...defaultCauldronParams.mainParams,
  userMaxBorrow: ethers.utils.parseUnits("1000000000000000000", 3),
};

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

const tooltip = vi.fn();

describe("AdditionalInfoBlock.vue default cauldron", () => {
  const wrapper: any = mount(AdditionalInfoBlock, {
    props: { cauldron: testEthCauldron },
    global: { plugins: [store], directives: { tooltip } },
  });

  it("Should render in default situation", () => {
    const additionalInfoBlock = wrapper.find(".info-list-wrap");
    expect(additionalInfoBlock.exists()).toBe(true);
  });

  it("Should calculate computed properties correct", () => {
    expect(wrapper.vm.oracleExchangeRate).toBe(1000);
    expect(wrapper.vm.userCollateralAmount).toBe(1000000);
    expect(wrapper.vm.userBorrowAmount).toBe(1000);
    expect(wrapper.vm.collateralToMim).toBe("0.001");
    expect(wrapper.vm.collateralInUsd).toBe(1000);
    expect(wrapper.vm.leftToBorrow).toBe("0");
    expect(wrapper.vm.additionalInfo).toContainEqual({
      additional: "Amount of Tokens Deposited as Collaterals",
      title: "Collateral Deposited",
      value: "1000000.0",
    });
    expect(wrapper.vm.additionalInfo).not.toContainEqual({
      title: "Withdrawable Amount",
      value: "1000000.0",
      additional: `Maximum Current Amount of magicAPE Withdrawable from this market. More will be available as this value approaches 0.`,
    });
    expect(wrapper.vm.additionalInfo).not.toContainEqual({
      title: "Maximum Borrowable MIM",
      value: "1000000.0",
      additional: `The maximum amount of MIM that your address can borrow in this particular market.`,
    });
    expect(wrapper.vm.additionalInfo).not.toContainEqual({
      title: "Maximum Borrowable MIM",
      value: "0.0",
      additional: `The maximum amount of MIM that your address can borrow in this particular market.`,
    });
  });
});

describe("AdditionalInfoBlock.vue whitelisted cauldron", () => {
  const wrapper: any = mount(AdditionalInfoBlock, {
    props: { cauldron: testWhitelistedCauldron },
    global: { plugins: [store], directives: { tooltip } },
  });

  it("Should have appropriate info object", () => {
    expect(
      wrapper.vm.additionalInfo.find(
        (infoItem: any) => infoItem.title === "Maximum Borrowable MIM"
      )
    ).toEqual({
      title: "Maximum Borrowable MIM",
      value: "1k",
      additional: `The maximum amount of MIM that your address can borrow in this particular market.`,
    });
  });
});

describe("AdditionalInfoBlock.vue cauldron with maxBorrow", () => {
  const wrapper: any = mount(AdditionalInfoBlock, {
    props: { cauldron: testCauldronWithMaxBorrow },
    global: { plugins: [store], directives: { tooltip } },
  });

  it("Should calculate computed properties correct", () => {
    expect(
      wrapper.vm.additionalInfo.find(
        (infoItem: any) => infoItem.title === "Maximum Borrowable MIM"
      )
    ).toEqual({
      title: "Maximum Borrowable MIM",
      value: "1k",
      additional: `The maximum amount of MIM that your address can borrow in this particular market.`,
    });
  });
});
