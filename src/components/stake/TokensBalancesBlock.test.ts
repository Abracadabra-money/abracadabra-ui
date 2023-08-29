import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import TokensBalancesBlock from "@/components/stake/TokensBalancesBlock.vue";
import { stakeInfo } from "@/utils/testConfigs/stakeMagicLvl";

describe("TrancheButton.vue", async () => {
  const props = { stakeInfo };
  const wrapper = mount(TokensBalancesBlock, { props });
  const tokensIcon = wrapper.findAll("img");
  const tokensName = wrapper.findAll(".token-name");
  const balancesTitle = wrapper.findAll(".balance-title");
  const balancesValue = wrapper.findAll(".balance-value");
  const tokensRate = wrapper.findAll(".tokens-rate");

  it("Should render Senior balances", async () => {
    expect(tokensIcon[0].attributes().src.includes("senior-icon.svg")).toBe(
      true
    );
    expect(tokensName[0].text()).toBe("Senior Tranche");
    expect(balancesTitle[0].text()).toBe("snrLLP Balance");
    expect(balancesValue[0].text()).toBe("0.87687");
    expect(balancesTitle[1].text()).toBe("mLVS Balance");
    expect(balancesValue[1].text()).toBe("1.6982");
    expect(tokensRate[0].text()).toBe("1 mLVL = 1.0493 LVL");
  });

  it("Should render Mezzanine balances", async () => {
    expect(tokensIcon[1].attributes().src.includes("mezzanine-icon.svg")).toBe(
      true
    );
    expect(tokensName[1].text()).toBe("Mezzanine Tranche");
    expect(balancesTitle[2].text()).toBe("mzeLLP Balance");
    expect(balancesValue[2].text()).toBe("1.5156");
    expect(balancesTitle[3].text()).toBe("mLVM Balance");
    expect(balancesValue[3].text()).toBe("0.0");
    expect(tokensRate[1].text()).toBe("1 mLVL = 1.0622 LVL");
  });

  it("Should render Junior balances", async () => {
    expect(tokensIcon[2].attributes().src.includes("junior-icon.svg")).toBe(
      true
    );
    expect(tokensName[2].text()).toBe("Junior Tranche");
    expect(balancesTitle[4].text()).toBe("jnrLLP Balance");
    expect(balancesValue[4].text()).toBe("0.696863");
    expect(balancesTitle[5].text()).toBe("mLVJ Balance");
    expect(balancesValue[5].text()).toBe("0.7");
    expect(tokensRate[2].text()).toBe("1 mLVL = 1.0519 LVL");
  });
});
