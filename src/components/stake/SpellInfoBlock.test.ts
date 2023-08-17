import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SpellInfoBlock from "@/components/stake/SpellInfoBlock.vue";
import { useImage } from "@/helpers/useImage";
import filters from "@/filters/index.js";

const stakeToken = {
  icon: useImage("assets/images/spell-icon.svg"),
  name: "SPELL",
  sSpellRate: 1.4723148649770834,
  balance: "52107.754389443514912797",
  price: 0.00048113,
};

const mainToken = {
  name: "mSPELL",
  icon: useImage("assets/images/mspell-icon.svg"),
  rate: 1,
  lockTimestamp: "0",
  balance: "1000.0",
  claimableAmount: "0.0",
  isTokenApproved: true,
  allowanceAmount: "99999999985126.97557398797023447",
  price: 0.00048113,
  apr: 14.12,
};

describe("SpellInfoBlock.vue", async () => {
  it("Should render items name", async () => {
    const props = { stakeToken, mainToken };
    const wrapper = mount(SpellInfoBlock, { props });
    const itemsName = wrapper.findAll(".item-name");

    expect(itemsName[0].text()).toBe(stakeToken.name);
    expect(itemsName[1].text()).toBe(mainToken.name);
    expect(itemsName[2].text()).toBe("Ratio");
    expect(itemsName[3].text()).toBe("Staking APR");
  });

  it("Should render tokens balance", async () => {
    const props = { stakeToken, mainToken };
    const wrapper = mount(SpellInfoBlock, { props });
    const itemsValue = wrapper.findAll(".item-value");

    expect(itemsValue[0].text()).toBe(
      filters.formatTokenBalance(stakeToken.balance)
    );
    expect(itemsValue[1].text()).toBe(
      filters.formatTokenBalance(mainToken.balance)
    );
  });

  it("Should render tokens price", async () => {
    const props = { stakeToken, mainToken };
    const wrapper = mount(SpellInfoBlock, { props });
    const itemsValueUsd = wrapper.findAll(".item-value-usd");

    expect(itemsValueUsd[0].text()).toBe("$ 25.07");
    expect(itemsValueUsd[1].text()).toBe("$ 0.481");
  });

  it("Should render Ratio", async () => {
    const props = { stakeToken, mainToken };
    const wrapper = mount(SpellInfoBlock, { props });
    const itemsValueUsd = wrapper.findAll(".item-text");

    expect(itemsValueUsd[0].text()).toBe("1 mSPELL = 1.0 SPELL");
  });

  it("Staking APR", async () => {
    const props = { stakeToken, mainToken };
    const wrapper = mount(SpellInfoBlock, { props });
    const itemsValueUsd = wrapper.findAll(".item-text");

    expect(itemsValueUsd[1].text()).toBe("14.12%");
  });

  it("Should not render LockedTimer component", async () => {
    const props = { stakeToken, mainToken };
    const wrapper = mount(SpellInfoBlock, { props });
    expect(wrapper.find(".timer-wrap").exists()).toBe(false);
  });

  it("Should render LockedTimer component", async () => {
    mainToken.lockTimestamp = "1691408988";

    const props = { stakeToken, mainToken };
    const wrapper = mount(SpellInfoBlock, { props });

    expect(wrapper.find(".timer-wrap").exists()).toBe(true);
    mainToken.lockTimestamp = "0";
  });
});
