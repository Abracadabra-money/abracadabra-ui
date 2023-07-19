import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import { ethers } from "ethers";
import PositionInfoBlock from "@/components/borrow/PositionInfoBlock.vue";
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

describe("PositionInfoBlock.vue", async () => {
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

  const wrapper: any = mount(PositionInfoBlock, {
    props: { cauldron: testEthCauldron },
    global: {
      plugins: [store],
    },
  });

  it("Should render and calculate computed properties in default situation", () => {
    const positionInfoBlock = wrapper.find(".position-info");
    expect(positionInfoBlock.exists()).toBe(true);
    expect(wrapper.vm.collateralDeposit).toBe("0.0");
    expect(wrapper.vm.oracleExchangeRate).toBe("0.000000001");
    expect(wrapper.vm.collateralValue).toBe("$ 0.0");
    expect(wrapper.vm.mimBorrowed).toBe("0.0");
    expect(wrapper.vm.liquidationPrice).toBe("$ 0.0");
    expect(wrapper.vm.liquidationRisk).toBe("100.00");
    expect(wrapper.vm.liquidationRiskClass).toBe("");
  });

  it("Should calculate computed properties if props have been passed", async () => {
    await wrapper.setProps({
      expectedCollateralAmount: 1000,
      expectedBorrowAmount: 1000,
      expectedLiquidationPrice: 100000000,
    });
    expect(wrapper.vm.collateralDeposit).toBe("1000.0");
    expect(wrapper.vm.oracleExchangeRate).toBe("0.000000001");
    expect(wrapper.vm.collateralValue).toBe("$ 1,000,000,000,000");
    expect(wrapper.vm.mimBorrowed).toBe("1000.0");
    expect(wrapper.vm.liquidationPrice).toBe("$ 100000000.0");
    expect(wrapper.vm.liquidationRisk).toBe("90.00");
    expect(wrapper.vm.liquidationRiskClass).toBe("safe");
  });

  it("Should calculate liquidationRiskClass to be high ", async () => {
    await wrapper.setProps({
      expectedLiquidationPrice: 1000000000,
    });
    expect(wrapper.vm.liquidationRisk).toBe(0);
    expect(wrapper.vm.liquidationRiskClass).toBe("high");
  });

  it("Should calculate liquidationRiskClass to be medium ", async () => {
    await wrapper.setProps({
      expectedLiquidationPrice: 500000000,
    });
    expect(wrapper.vm.liquidationRisk).toBe("50.00");
    expect(wrapper.vm.liquidationRiskClass).toBe("medium");
  });

  it("Should calculate liquidationRiskClass to be safe ", async () => {
    await wrapper.setProps({
      expectedLiquidationPrice: 100000000,
    });
    expect(wrapper.vm.liquidationRisk).toBe("90.00");
    expect(wrapper.vm.liquidationRiskClass).toBe("safe");
  });
});
