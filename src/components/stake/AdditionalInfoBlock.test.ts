import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import AdditionalInfoBlock from "@/components/stake/AdditionalInfoBlock.vue";

describe("AdditionalInfoBlock", () => {
  const configs = [
    {
      title: "Title",
      tooltip: "Tooltip",
      icon: "icon.png",
      amount: 100000000000000000000n,
      decimals: 18,
      amountUsd: 100000000000000000000n,
    },
    {
      title: "Title 2",
      tooltip: "Tooltip 2",
      icon: "icon2.png",
      amount: 200000000000000000000n,
      decimals: 18,
      amountUsd: 200000000000000000000n,
    },
  ];

  it("renders the correct number of info items", () => {
    const wrapper = shallowMount(AdditionalInfoBlock, {
      props: { configs },
    });

    const infoItems = wrapper.findAll(".info-item");
    expect(infoItems.length).toBe(configs.length);
  });

  it("formats the token balance correctly", () => {
    const wrapper = shallowMount(AdditionalInfoBlock, {
      props: { configs: [configs[0]] },
    });

    const valueElement = wrapper.find(".value");
    expect(valueElement.text()).toBe("100");
  });

  it("formats the USD value correctly", () => {
    const wrapper = shallowMount(AdditionalInfoBlock, {
      props: { configs: [configs[0]] },
    });

    const priceElement = wrapper.find(".price");
    expect(priceElement.text()).toBe("$ 100");
  });
});
