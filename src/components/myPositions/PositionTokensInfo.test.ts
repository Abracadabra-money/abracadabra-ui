import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import PositionTokensInfo from "@/components/myPositions/PositionTokensInfo.vue";

import config from "@/utils/cauldronsConfig/ethereumCauldrons";

const cauldron = {
  config: config[4],
  oracleRate: 100,
  collateralInfo: {
    userCollateralShare: 1000,
    userCollateralAmount: 1000,
  },
  borrowInfo: 1000,
  liquidationPrice: 1000,
};

describe("PositionTokensInfo.vue", () => {
  it("Should use props correct", () => {
    const wrapper = mount(PositionTokensInfo, {
      props: {
        position: cauldron,
        tokenName: "sSPELL",
      },
    });

    expect(wrapper.vm.tokenIcon).toContain("assets/images/tokens/sSPELL.png");
    expect(wrapper.vm.tokenSymbol).toBe("sSPELL");
    expect(wrapper.vm.oracleRate).toBe("0.0000000000000001");
    expect(wrapper.vm.tokenToMim).toBe("10000000000000000.0");
    expect(wrapper.vm.tokensRate).toBe("1 sSPELL = 10000000000000000.0 MIM");
  });

  it("Should use position prop if tokenName have not passed", () => {
    const wrapper = mount(PositionTokensInfo, {
      props: {
        position: cauldron,
      },
    });
    expect(wrapper.vm.tokenSymbol).toBe("sSPELL");
  });
});
