import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import ClaimButton from "@/components/ui/buttons/ClaimButton.vue";
import ethConfig from "@/utils/cauldronsConfig/ethereumCauldrons";
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

describe("ClaimButton.vue", () => {
  const store = new Vuex.Store({
    modules: {
      connectProvider: {
        state: { account: "0x0" },
        getters: {
          getAccount: (state) => state.account,
        },
      },
    },
  });

  const wrapper: any = mount(ClaimButton, {
    props: { cauldron: testEthCauldron },
    global: { plugins: [store] },
  });

  it("Should not render if there is no reward", () => {
    const claimBtn = wrapper.find(".claim-btn");
    expect(claimBtn.exists()).toBe(false);
  });

  it("Should render if there is reward", async () => {
    await wrapper.setData({ reward: 1 });

    const claimBtn = wrapper.find(".claim-btn");
    expect(claimBtn.exists()).toBe(true);
  });

  it("Should work onClick", async () => {
    await wrapper.setData({ reward: 1 });

    const spy = vi.spyOn(wrapper.vm, "actionHandler");

    const claimBtn = wrapper.find(".claim-btn");
    claimBtn.trigger("click");
    expect(spy).toHaveBeenCalled();
  });
});
