import { describe, it, expect } from "vitest";
import { shallowMount, mount } from "@vue/test-utils";
import StakeInfoBlock from "@/components/stake/StakeInfoBlock.vue";

describe("StakeInfoBlock", () => {
  const mainToken = {
    name: "Main Token",
    icon: "main-token-icon",
    rate: BigInt(1),
    balance: BigInt(100000000000000000000),
    balanceUsd: BigInt(200000000000000000000),
    decimals: 18,
    contract: {
      address: "0x1234" as `0x${string}`,
      abi: "mainnet",
    },
    rateIcon: "rateIcon.png",
    price: BigInt(100000000000000000000),
    totalSupply: BigInt(100000000000000000000),
    totalSupplyUsd: BigInt(100000000000000000000),
  };

  const stakeToken = {
    name: "Stake Token",
    icon: "stake-token-icon",
    balance: BigInt(5000000000000000000),
    balanceUsd: BigInt(7000000000000000000),
    contract: {
      address: "0x1234" as `0x${string}`,
      abi: "mainnet",
    },
    price: BigInt(2000),
    decimals: 18,
    approvedAmount: BigInt(3000),
  };

  it("renders the correct tokens rate", () => {
    const wrapper = shallowMount(StakeInfoBlock, {
      props: {
        mainToken,
        stakeToken,
      },
    });

    const tokensRate = wrapper.find(".value").text();
    expect(tokensRate).toBe("1 Main Token = 0 Stake Token");
  });

  it("renders the correct APR", async () => {
    const wrapper = mount(StakeInfoBlock, {
      props: {
        mainToken,
        stakeToken,
      },

      data() {
        return {
          apr: 5,
        };
      },
    });

    await wrapper.vm.$nextTick();

    const apr = wrapper.findAll(".value");
    expect(apr[1].text()).toBe("5%");
  });

  it("renders the correct tokens balance", () => {
    const wrapper = shallowMount(StakeInfoBlock, {
      props: {
        mainToken,
        stakeToken,
      },
    });

    const tokensBalance = wrapper.findAll(".value");
    expect(tokensBalance[1].text()).toBe("100 ($ 200)");
    expect(tokensBalance[2].text()).toBe("5 ($ 7)");
  });
});
