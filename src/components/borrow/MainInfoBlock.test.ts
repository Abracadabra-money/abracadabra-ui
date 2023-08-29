import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import { ethers } from "ethers";
import MainInfoBlock from "@/components/borrow/MainInfoBlock.vue";
import ethConfig from "@/utils/cauldronsConfig/ethereumCauldrons";
import arbConfig from "@/utils/cauldronsConfig/arbitrumCauldrons";

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
  additionalInfo: { feePercent: 5 },
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

const testEthCollateralInterestCauldron = {
  config: ethConfig[19],
  contracts: {
    collateral: new ethers.Contract(
      ethConfig[19].collateralInfo.address,
      ethConfig[19].collateralInfo.abi,
      testProvider
    ),
  },
  ...defaultCauldronParams,
};

const testEthShibCauldron = {
  config: ethConfig[11],
  contracts: {
    collateral: new ethers.Contract(
      ethConfig[11].collateralInfo.address,
      ethConfig[11].collateralInfo.abi,
      testProvider
    ),
  },
  ...defaultCauldronParams,
};

const testArbGlpCauldron = {
  config: arbConfig[1],
  contracts: {
    collateral: new ethers.Contract(
      arbConfig[1].collateralInfo.address,
      arbConfig[1].collateralInfo.abi,
      testProvider
    ),
  },
  ...defaultCauldronParams,
};

const ethStore = new Vuex.Store({
  modules: {
    connectProvider: {
      state: { chainId: 1, signer: {} },
      getters: {
        getChainId: (state) => state.chainId,
        getSigner: (state) => state.signer,
      },
    },
  },
});

const arbStore = new Vuex.Store({
  modules: {
    connectProvider: {
      state: { chainId: 42161, signer: {} },
      getters: {
        getChainId: (state) => state.chainId,
        getSigner: (state) => state.signer,
      },
    },
  },
});

const tooltip = vi.fn();

describe("MainInfoBlock.vue, default cauldron", async () => {
  it("Should render ", () => {
    const wrapper: any = mount(MainInfoBlock, {
      props: { cauldron: testEthCauldron },
      global: { plugins: [ethStore], directives: { tooltip } },
    });

    const mainInfoBlock = wrapper.find(".main-info-list");
    expect(mainInfoBlock.exists()).toBe(true);
  });

  it("Should calculate computed properties correct", () => {
    const wrapper: any = mount(MainInfoBlock, {
      props: { cauldron: testEthCauldron },
      global: { plugins: [ethStore], directives: { tooltip } },
    });

    expect(wrapper.vm.isGlpPool).toBe(false);
    expect(wrapper.vm.isVelodrome).toBe(false);
    expect(wrapper.vm.isCollateralInterest).toBe(false);
    expect(wrapper.vm.collateralToMim).toBe("999999999.9999");

    expect(wrapper.vm.info).toContainEqual({
      name: "Borrow fee",
      value: defaultCauldronParams.mainParams.borrowFee,
      tooltip: "This fee is added to your debt every time you borrow MIM.",
    });

    expect(wrapper.vm.info).toContainEqual({
      name: "Interest",
      value: defaultCauldronParams.mainParams.interest,
      tooltip:
        "This is the annualized percent that your debt will increase each year.",
    });

    expect(wrapper.vm.info).not.toContainEqual({
      name: "Management Fee",
      value: defaultCauldronParams.additionalInfo.feePercent,
      tooltip: `Percentage of rewards taken by the protocol when harvesting WETH rewards. This value changes dynamically to ensure a 15% APR for Abracadabra.`,
    });

    expect(wrapper.vm.info).toContainEqual({
      name: "Price",
      value: "$ 999999999.9999",
      tooltip: "Price of one collateral token",
    });
  });
});

describe("MainInfoBlock.vue, GLP cauldron", async () => {
  it("Should calculate computed properties correct", () => {
    const wrapper: any = mount(MainInfoBlock, {
      props: { cauldron: testArbGlpCauldron },
      global: { plugins: [arbStore], directives: { tooltip } },
    });

    expect(wrapper.vm.isGlpPool).toBe(true);

    expect(wrapper.vm.info).toContainEqual({
      name: "Management Fee",
      value: `5`,
      tooltip: `Percentage of rewards taken by the protocol when harvesting WETH rewards. This value changes dynamically to ensure a 15% APR for Abracadabra.`,
    });
  });
});

describe("MainInfoBlock.vue, ETH collateralInterest cauldron", async () => {
  it("Should calculate computed properties correct", () => {
    const wrapper: any = mount(MainInfoBlock, {
      props: { cauldron: testEthCollateralInterestCauldron },
      global: { plugins: [ethStore], directives: { tooltip } },
    });

    expect(wrapper.vm.isCollateralInterest).toBe(true);

    expect(wrapper.vm.info).toContainEqual({
      name: "Interest",
      value: defaultCauldronParams.mainParams.interest,
      tooltip:
        "This is the annualized percent that your collateral will decrease each year.",
    });
  });
});
