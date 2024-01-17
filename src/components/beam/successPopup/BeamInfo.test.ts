import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import BeamInfo from "@/components/beam/successPopup/BeamInfo.vue";

describe("BeamInfo", () => {
  it("renders the correct values", () => {
    const config = {
      mimToUsd: 10,
      totalGas: 100,
      nativeSymbol: "ETH",
      totalGasUsd: 1000,
      gasOnDst: 0.001,
      dstTokenAmount: 10,
      srcTokenPrice: 1,
      srcTokenIcon: "srcTokenIcon.png",
      dstTokenIcon: "dstTokenIcon.png",
      dstTokenSymbol: "USDT",
    };

    const wrapper = shallowMount(BeamInfo, {
      propsData: {
        config,
      },
    });

    expect(wrapper.find(".usd").text()).toBe("10");
    expect(wrapper.find(".token").text()).toBe("100 ETH");
    expect(wrapper.findAll(".gas-token-value")[0].text()).toBe("0.001 ETH");
    expect(wrapper.findAll(".gas-token-value")[1].text()).toBe("10.0 USDT");
  });

  it("renders the correct original token amount", () => {
    const config = {
      mimToUsd: 10,
      totalGas: 100,
      nativeSymbol: "ETH",
      totalGasUsd: 1000,
      gasOnDst: 0.001,
      dstTokenAmount: 0,
      srcTokenPrice: 1,
      srcTokenIcon: "srcTokenIcon.png",
      dstTokenIcon: "dstTokenIcon.png",
      dstTokenSymbol: "USDT",
    };

    const wrapper = shallowMount(BeamInfo, {
      propsData: {
        config,
      },
    });

    expect(wrapper.find(".gas-token-value").text()).toBe("0.001 ETH");
  });

  it("renders the correct destination token amount", () => {
    const config = {
      mimToUsd: 10,
      totalGas: 100,
      nativeSymbol: "ETH",
      totalGasUsd: 1000,
      gasOnDst: 0.001,
      dstTokenAmount: 0.123456789,
      srcTokenPrice: 1,
      srcTokenIcon: "srcTokenIcon.png",
      dstTokenIcon: "dstTokenIcon.png",
      dstTokenSymbol: "USDT",
    };

    const wrapper = shallowMount(BeamInfo, {
      propsData: {
        config,
      },
    });

    expect(wrapper.findAll(".gas-token-value")[1].text()).toBe("0.123 USDT");
  });
});
