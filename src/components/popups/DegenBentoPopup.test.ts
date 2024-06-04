import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import BaseButton from "@/components/base/BaseButton.vue";
import DegenBentoPopup from "@/components/popups/DegenBentoPopup.vue";
import type { Address } from "viem";

const testInfoObject = {
  chainId: 1,
  tokenInfo: {
    name: "MIM",
    symbol: "MIM",
    chainId: 1,
    decimals: 18,
    address: "0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3" as Address,
    abi: [],
    image:
      "https://fra1.digitaloceanspaces.com/static.popsicle.finance/mimlogopng.png",
  },
  bentoContractInfo: {
    chainId: 1,
    name: "BentoBoxV1",
    contractChain: "0x01",
    address: "0xF5BCE5077908a1b7370B9ae04AdC565EBd643966" as Address,
    abi: [],
  },
  degenContractInfo: {
    chainId: 1,
    name: "DegenBox",
    contractChain: "0x01",
    address: "0xd96f48665a1410C0cd669A88898ecA36B9Fc2cce" as Address,
    abi: [],
  },
  bentoAllowance: 100n,
  degenAllowance: 200n,
  mimBalance: 500n,
  mimInBentoBalance: 300n,
  mimInDegenBalance: 400n,
  mimPrice: 1,
};

describe("DegenBentoPopup", () => {
  it("renders correctly", () => {
    const wrapper = shallowMount(DegenBentoPopup, {
      props: {
        infoObject: testInfoObject,
        isBento: true,
        isDeposit: false,
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".backdrop").exists()).toBe(true);
    expect(wrapper.find(".box-popup").exists()).toBe(true);
    expect(wrapper.find(".box-header").exists()).toBe(true);
    expect(wrapper.find(".title").exists()).toBe(true);
    expect(wrapper.find(".close-img").exists()).toBe(true);
    expect(wrapper.find(".description").exists()).toBe(true);
    expect(wrapper.find(".withdraw-input").exists()).toBe(true);
    expect(wrapper.findComponent(BaseButton).exists()).toBe(true);
  });

  it('emits "close" event when closePopup is called', () => {
    const wrapper = shallowMount(DegenBentoPopup, {
      props: {
        infoObject: testInfoObject,
        isBento: true,
        isDeposit: false,
      },
    });

    wrapper.vm.closePopup();

    expect(wrapper.emitted("close")).toBeTruthy();
  });
});
