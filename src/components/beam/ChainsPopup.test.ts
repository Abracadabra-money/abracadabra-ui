import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ChainsPopup from "@/components/beam/ChainsPopup.vue";

const networksArr = [
  {
    chainId: 56,
    lzChainId: 102,
    title: "BSC",
    icon: "http://127.0.0.1:5173/src/assets/images/networks/binance.svg",
  },
  {
    chainId: 42161,
    lzChainId: 110,
    title: "Arbitrum",
    icon: "http://127.0.0.1:5173/src/assets/images/networks/arbitrum-chain.svg",
  },
  {
    chainId: 137,
    lzChainId: 109,
    title: "Polygon",
    icon: "http://127.0.0.1:5173/src/assets/images/networks/polygon.svg",
  },
];

describe("ChainsPopup.vue", () => {
  it("Should render three network selection elements 'BSC', 'Arbitrum' and 'Polygon'", () => {
    const wrapper = mount(ChainsPopup, {
      props: { isOpen: true, networksArr },
    });
    const chainsSymmbol = wrapper.findAll("p");
    const chainsIcon = wrapper.findAll(".chain-icon");

    expect(chainsSymmbol[0].text()).toBe(networksArr[0].title);
    expect(chainsIcon[0].attributes().src).toBe(networksArr[0].icon);

    expect(chainsSymmbol[1].text()).toBe(networksArr[1].title);
    expect(chainsIcon[1].attributes().src).toBe(networksArr[1].icon);

    expect(chainsSymmbol[2].text()).toBe(networksArr[2].title);
    expect(chainsIcon[2].attributes().src).toBe(networksArr[2].icon);
  });

  it("Should render three network selection elements and 'Arbitrum' should be active", () => {
    const wrapper = mount(ChainsPopup, {
      props: {
        isOpen: true,
        networksArr,
        activeChain: 42161,
        selectChain: true,
      },
    });
    const selecItems = wrapper.findAll(".select-item");
    expect(selecItems[1].classes().includes("active")).toBe(true);
  });
});
