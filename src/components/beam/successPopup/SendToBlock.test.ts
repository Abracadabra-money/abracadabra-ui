import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SendToBlock from "@/components/beam/successPopup/SendToBlock.vue";
import filters from "@/filters";
import { useImage } from "@/helpers/useImage";

const fullConfig = {
  sendFrom: "0x000000",
  sendTo: "0x111111",
  originChain: { title: "ETH", icon: "", chainId: 1 },
  mimAmount: 1000,
  nativeSymbol: "ETH",
  gasOnDst: filters.formatToFixed(1000, 3),
  dstTokenSymbol: "BSC",
  dstChain: { title: "binance-smart-chain", chainId: 56 },
  dstTokenAmount: 500,
  dstTokenPrice: 2,
  tx: { hash: "txHash" },
  txInfo: "txInfo",
  mimToUsd: 1000,
  dstChainId: 56,
};
const missingFieldsConfig = {
  sendFrom: "0x000000",
  sendTo: "0x111111",
  originChain: { title: "ETH", icon: "", chainId: 1 },
  mimAmount: 1000,
  nativeSymbol: "ETH",
  gasOnDst: null,
  dstTokenSymbol: "BSC",
  dstChain: { title: "binance-smart-chain", chainId: 56 },
  dstTokenAmount: null,
  dstTokenPrice: 2,
  tx: null,
  txInfo: null,
  mimToUsd: 1000,
  dstChainId: 56,
};

describe("SendToBlock.vue", () => {
  it("Should have correct computed properties if passed config has missing fields", () => {
    const wrapper = mount(SendToBlock, {
      props: {
        config: missingFieldsConfig,
      },
    });

    expect(wrapper.vm.sendToCheck).toBe(
      useImage("assets/images/beam/check.png")
    );
    expect(wrapper.vm.sendTo).toBe("0x11...111");
    expect(wrapper.vm.dstScanUrl).toBe("");
    expect(wrapper.vm.destinationTokenUsd).toBe("$ 0.0");
  });

  it("Should have correct computed properties if passed config is completely full", () => {
    const wrapper = mount(SendToBlock, {
      props: {
        config: fullConfig,
      },
    });

    expect(wrapper.vm.sendToCheck).toBe(
      useImage("assets/images/beam/complete.png")
    );
    expect(wrapper.vm.sendTo).toBe("0x11...111");
    expect(wrapper.vm.dstScanUrl).toBe("https://bscscan.com/tx/undefined");
    expect(wrapper.vm.destinationTokenUsd).toBe("$ 1,000");
  });
});
