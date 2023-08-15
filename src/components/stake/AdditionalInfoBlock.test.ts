import { describe, it, expect } from "vitest";
import ClaimMimBlock from "@/components/stake/AdditionalInfoBlock.vue";
import { mount } from "@vue/test-utils";
import filters from "@/filters/index.js";
import {
  mainToken,
  rewardToken,
  emptyMainToken,
  emptyRewardToken,
} from "@/utils/testConfigs/stakeMagicGlp";

describe("AdditionalInfoBlock.vue", async () => {
  it("Should render Total Supply block", async () => {
    const props = { mainToken, rewardToken };
    const wrapper = mount(ClaimMimBlock, { props });

    const tokensSymbol = wrapper.findAll(".token-symbol");
    const amounts = wrapper.findAll(".amount");
    const prices = wrapper.findAll(".price");

    expect(tokensSymbol[0].text()).toBe("magicGLP");
    expect(amounts[0].text()).toBe(filters.formatTokenBalance("1081.8821"));
    expect(prices[0].text()).toBe("$ 882.83");
  });

  it("Should render Total Supply with zeros", async () => {
    const props = { mainToken: emptyMainToken, rewardToken: emptyRewardToken };
    const wrapper = mount(ClaimMimBlock, { props });

    const tokensSymbol = wrapper.findAll(".token-symbol");
    const amounts = wrapper.findAll(".amount");
    const prices = wrapper.findAll(".price");

    expect(tokensSymbol[0].text()).toBe("magicGLP");
    expect(amounts[0].text()).toBe("0.0");
    expect(prices[0].text()).toBe("$ 0.0");
  });

  it("Should render Total Rewards Earned block", async () => {
    const props = { mainToken, rewardToken };
    const wrapper = mount(ClaimMimBlock, { props });

    const tokensSymbol = wrapper.findAll(".token-symbol");
    const amounts = wrapper.findAll(".amount");
    const prices = wrapper.findAll(".price");

    expect(tokensSymbol[1].text()).toBe("ETH");
    expect(amounts[1].text()).toBe("1.434");
    expect(prices[1].text()).toBe("$ 17.63");
  });

  it("Should render Total Rewards Earned with zeros", async () => {
    const props = { mainToken: emptyMainToken, rewardToken: emptyRewardToken };
    const wrapper = mount(ClaimMimBlock, { props });

    const tokensSymbol = wrapper.findAll(".token-symbol");
    const amounts = wrapper.findAll(".amount");
    const prices = wrapper.findAll(".price");

    expect(tokensSymbol[1].text()).toBe("ETH");
    expect(amounts[1].text()).toBe("0.0");
    expect(prices[1].text()).toBe("$ 0.0");
  });
});
