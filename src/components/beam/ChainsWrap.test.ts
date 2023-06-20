import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ChainsWrap from "@/components/beam/ChainsWrap.vue";
import { useImage } from "@/helpers/useImage";

const fromChain = {
  icon: useImage("assets/images/networks/ethereum.svg"),
  title: "Ethereum",
};

const toChain = {
  icon: useImage("assets/images/networks/binance.svg"),
  title: "BSC",
};

describe("ChainsPopup.vue", () => {
  it("Should render Origin Chain 'Ethereum' and Destination Chain 'Select chain' ", () => {
    const wrapper = mount(ChainsWrap, {
      props: { selectChain: false, fromChain, toChain },
    });
    const chainsTitle = wrapper.findAll("p");
    expect(chainsTitle[0].text()).toBe("Ethereum");
    expect(chainsTitle[1].text()).toBe("Select chain");
  });

  it("Should render Origin Chain 'Ethereum' and Destination Chain 'BSC' ", () => {
    const wrapper = mount(ChainsWrap, {
      props: { selectChain: true, fromChain, toChain },
    });
    const chainsTitle = wrapper.findAll("p");
    expect(chainsTitle[0].text()).toBe("Ethereum");
    expect(chainsTitle[1].text()).toBe("BSC");
  });
});
