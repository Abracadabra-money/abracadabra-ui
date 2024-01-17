import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import BeamProcess from "@/components/beam/successPopup/BeamProcess.vue";

describe("BeamProcess", () => {
  it("renders the correct address", () => {
    const config = {
      sendFrom: "0x1234567890abcdef",
      sendTo: "0x9999567890abcdef",
      originChain: {
        icon: "path/to/origin-chain-icon.png",
      },
      dstChain: {
        icon: "path/to/dst-chain-icon.png",
      },
    };
    const wrapper = shallowMount(BeamProcess, {
      propsData: {
        config,
      },
    });

    const addressElement = wrapper.find(".address");
    expect(addressElement.text()).toBe("0x12...def");
  });

  it("renders the correct beam amount", () => {
    const config = {
      mimAmount: 100,
      sendFrom: "0x1234567890abcdef",
      sendTo: "0x9999567890abcdef",
      originChain: {
        icon: "path/to/origin-chain-icon.png",
      },
      dstChain: {
        icon: "path/to/dst-chain-icon.png",
      },
    };

    const wrapper = shallowMount(BeamProcess, {
      propsData: {
        config,
      },
    });

    const beamAmountElement = wrapper.find(".beam-amount");
    expect(beamAmountElement.text()).toBe("100");
  });

  it("renders the correct origin chain icon", () => {
    const config = {
      sendFrom: "0x1234567890abcdef",
      sendTo: "0x9999567890abcdef",
      originChain: {
        icon: "path/to/origin-chain-icon.png",
      },
      dstChain: {
        icon: "path/to/dst-chain-icon.png",
      },
    };
    const wrapper = shallowMount(BeamProcess, {
      propsData: {
        config,
      },
    });

    const iconElement = wrapper.find(".indicator-icon");
    expect(iconElement.attributes("src")).toBe("path/to/origin-chain-icon.png");
  });

  it("renders the correct destination chain icon", () => {
    const config = {
      sendFrom: "0x1234567890abcdef",
      sendTo: "0x9999567890abcdef",
      originChain: {
        icon: "path/to/origin-chain-icon.png",
      },
      dstChain: {
        icon: "path/to/dst-chain-icon.png",
      },
    };
    const wrapper = shallowMount(BeamProcess, {
      propsData: {
        config,
      },
    });

    const iconElement = wrapper.findAll(".indicator-icon");
    expect(iconElement[1].attributes("src")).toBe("path/to/dst-chain-icon.png");
  });
});
