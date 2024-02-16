import { utils } from "ethers";
import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import TokenInfo from "@/components/market/TokenInfo.vue";

describe("TokenInfo", () => {
  it("renders the token name correctly", () => {
    const cauldron = {
      config: {
        name: "Token Name",
        collateralInfo: {
          decimals: 18,
        },
      },
      mainParams: {
        oracleExchangeRate: 1,
      },
    };

    const wrapper = shallowMount(TokenInfo, {
      propsData: {
        cauldron,
      },
    });

    expect(wrapper.find(".token-name").text()).toBe("Token Name");
  });

  it("renders the tokens rate correctly", () => {
    const cauldron = {
      config: {
        name: "Token Name",
        collateralInfo: {
          decimals: 18,
        },
      },
      mainParams: {
        oracleExchangeRate: utils.parseUnits("0.01", 18),
      },
    };

    const wrapper = shallowMount(TokenInfo, {
      propsData: {
        cauldron,
      },
    });

    expect(wrapper.find(".tokens-rate").text()).toBe("1 Token Name = $ 100");
  });
});
