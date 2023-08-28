import { describe, it, expect } from "vitest";
import BalancesBlock from "@/components/stake/BalancesBlock.vue";
import { mount } from "@vue/test-utils";
import {
  mainToken,
  stakeToken,
  emptyMainToken,
  emptyStakeToken,
} from "@/utils/testConfigs/stakeMagicGlp";

describe("BalancesBlock.vue", async () => {
  it("Should render rate", async () => {
    const props = { mainToken, stakeToken };
    const wrapper = mount(BalancesBlock, { props });

    expect(wrapper.find(".token-rate-value").text()).toBe(
      "1 magicGLP = 1.0576 GLP"
    );
  });

  it("Should render balance GLP", async () => {
    const props = { mainToken, stakeToken };
    const wrapper = mount(BalancesBlock, { props });

    const tokensSymbol = wrapper.findAll(".token-symbol");
    const amounts = wrapper.findAll(".token-amount");
    const prices = wrapper.findAll(".token-price");

    expect(tokensSymbol[0].text()).toBe("GLP");
    expect(amounts[0].text()).toBe("5.5245");
    expect(prices[0].text()).toBe("$ 5.51");
  });

  it("Should render balance GLP with zeros", async () => {
    const props = { mainToken: emptyMainToken, stakeToken: emptyStakeToken };
    const wrapper = mount(BalancesBlock, { props });

    const tokensSymbol = wrapper.findAll(".token-symbol");
    const amounts = wrapper.findAll(".token-amount");
    const prices = wrapper.findAll(".token-price");

    expect(tokensSymbol[0].text()).toBe("GLP");
    expect(amounts[0].text()).toBe("0.0");
    expect(prices[0].text()).toBe("$ 0.0");
  });

  it("Should render balance magicGLP", async () => {
    const props = { mainToken, stakeToken };
    const wrapper = mount(BalancesBlock, { props });

    const tokensSymbol = wrapper.findAll(".token-symbol");
    const amounts = wrapper.findAll(".token-amount");
    const prices = wrapper.findAll(".token-price");

    expect(tokensSymbol[1].text()).toBe("magicGLP");
    expect(amounts[1].text()).toBe("5.4076");
    expect(prices[1].text()).toBe("$ 5.97");
  });

  it("Should render balance magicGLP  with zeros", async () => {
    const props = { mainToken: emptyMainToken, stakeToken: emptyStakeToken };
    const wrapper = mount(BalancesBlock, { props });

    const tokensSymbol = wrapper.findAll(".token-symbol");
    const amounts = wrapper.findAll(".token-amount");
    const prices = wrapper.findAll(".token-price");

    expect(tokensSymbol[1].text()).toBe("magicGLP");
    expect(amounts[1].text()).toBe("0.0");
    expect(prices[1].text()).toBe("$ 0.0");
  });
});
