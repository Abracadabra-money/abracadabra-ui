import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import BalancesBlock from "@/components/stake/spell/BalancesBlock.vue";

describe("BalancesBlock", () => {
  const configs = [
    {
      label: "Token 1",
      balance: BigInt(100000000000000000000),
      icon: "token1.png",
      price: BigInt(200000000000000000000),
    },
    {
      label: "Token 2",
      balance: BigInt(200000000000000000000),
      icon: "token2.png",
      price: BigInt(300000000000000000000),
    },
    {
      label: "Token 3",
      balance: BigInt(300000000000000000000),
      icon: "token3.png",
      price: BigInt(400000000000000000000),
    },
  ];

  it("renders the correct number of balance items", () => {
    const wrapper = shallowMount(BalancesBlock, {
      props: { configs },
    });

    const balanceItems = wrapper.findAll(".balance-item");
    expect(balanceItems.length).toBe(configs.length);
  });

  it("formats the token balance correctly", () => {
    const wrapper = shallowMount(BalancesBlock, {
      props: { configs: [configs[0]] },
    });

    const value = wrapper.find(".value");
    expect(value.text()).toBe("100");
  });

  it("formats the USD value correctly", () => {
    const wrapper = shallowMount(BalancesBlock, {
      props: { configs: [configs[0]] },
    });

    const price = wrapper.find(".price");

    expect(price.text()).toBe("$ 20,000");
  });
});
