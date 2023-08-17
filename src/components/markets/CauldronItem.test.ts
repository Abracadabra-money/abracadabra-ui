import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import { ethers } from "ethers";
import CauldronItem from "@/components/markets/CauldronItem.vue";
import arbConfig from "@/utils/cauldronsConfig/arbitrumCauldrons";
import { useImage } from "@/helpers/useImage";

const defaultCauldronParams = {
  borrowFee: 1,
  interest: 1,
  liquidationFee: 1,
  collateralPrice: ethers.utils.parseUnits("1000000000000000", 3),
  mimLeftToBorrow: ethers.utils.parseUnits("1000000000000000", 3),
  maximumCollateralRatio: ethers.utils.parseUnits("1000000000000000", 3),
  oracleExchangeRate: ethers.utils.parseUnits("1000000000000000", 3),
  totalBorrowed: ethers.utils.parseUnits("1000000000000000", 3),
  tvl: ethers.utils.parseUnits("1000000000000000", 3),
  userMaxBorrow: ethers.utils.parseUnits("1000000000000000", 3),
  updatePrice: false,
};

const testArbCauldronDefault = {
  config: arbConfig[0],
  ...defaultCauldronParams,
};

const testArbCauldronDeprecated = {
  config: arbConfig[1],
  ...defaultCauldronParams,
};

const testArbCauldronNew = {
  config: arbConfig[2],
  ...defaultCauldronParams,
};

const store = new Vuex.Store({
  modules: {
    connectProvider: {
      state: { chainId: 42161 },
      getters: {
        getChainId: (state) => state.chainId,
      },
    },
    networks: {
      state: {
        chainIcon: useImage("assets/images/networks/arbitrum-icon.svg"),
      },
      getters: {
        getChainIcon: (state) => (chainId: number) => state.chainIcon,
      },
    },
  },
});

describe("CauldronItem.vue default cauldron", async () => {
  const wrapperDefault: any = mount(CauldronItem, {
    props: { cauldron: testArbCauldronDefault },
    global: { plugins: [store] },
  });

  it("Should render correct with default cauldron passed", () => {
    const cauldronItem = wrapperDefault.find(".cauldron-item");
    expect(cauldronItem.exists()).toBe(true);

    const collateralLabel = wrapperDefault
      .find(".collateral-labels")
      .find("span");
    expect(collateralLabel.text()).toBe("WETH");
    expect(collateralLabel.classes()).not.toContain([
      "new-label",
      "deprecated-label",
    ]);
  });

  it("Should calculate computed properties correct with default cauldron passed", () => {
    expect(wrapperDefault.vm.goToCauldron).toMatchObject({
      name: "BorrowId",
      params: { id: 1 },
    });
    expect(wrapperDefault.vm.cauldronInfo).toEqual([
      {
        title: "TOTAL MIM BORROWED",
        value: "1",
      },

      {
        title: "TVL",
        value: "$ 1",
      },
      {
        title: "MIMS LEFT TO BORROW",
        value: "1",
      },
      {
        title: "INTEREST",
        value: "1%",
      },
    ]);
  });
});

describe("CauldronItem.vue new cauldron", async () => {
  const wrapperNew: any = mount(CauldronItem, {
    props: { cauldron: testArbCauldronNew },
    global: { plugins: [store] },
  });

  it("Should render correct with new cauldron passed", () => {
    expect(wrapperNew.vm.isNewLabel).toBe(true);
    const collateralLabels = wrapperNew
      .find(".collateral-labels")
      .findAll("span");
    expect(collateralLabels[0].text()).toBe("MagicGLP");
    expect(collateralLabels[1].classes()).toContain("new-label");
  });

  it("Should calculate computed properties correct with new cauldron passed", () => {
    expect(wrapperNew.vm.goToCauldron).toMatchObject({
      name: "BorrowId",
      params: { id: 3 },
    });
    expect(wrapperNew.vm.cauldronInfo).toEqual([
      {
        title: "TOTAL MIM BORROWED",
        value: "1",
      },

      {
        title: "TVL",
        value: "$ 1",
      },
      {
        title: "MIMS LEFT TO BORROW",
        value: "1",
      },
      {
        title: "INTEREST",
        value: "1%",
      },
    ]);
  });
});

describe("CauldronItem.vue deprecated cauldron", async () => {
  const wrapperDeprecated: any = mount(CauldronItem, {
    props: { cauldron: testArbCauldronDeprecated },
    global: { plugins: [store] },
  });

  it("Should render correct with deprecated cauldron passed", () => {
    const collateralLabels = wrapperDeprecated
      .find(".collateral-labels")
      .findAll("span");
    expect(collateralLabels[0].text()).toBe("GLP");
    expect(collateralLabels[1].classes()).toContain("deprecated-label");
  });

  it("Should calculate computed properties correct with deprecated cauldron passed", () => {
    expect(wrapperDeprecated.vm.goToCauldron).toMatchObject({
      name: "RepayId",
      params: { id: 2 },
    });
  });
});
