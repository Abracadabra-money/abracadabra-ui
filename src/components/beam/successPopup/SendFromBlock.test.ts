import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SendFromBlock from "@/components/beam/successPopup/SendFromBlock.vue";
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
  dstChain: "binance-smart-chain",
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
  dstChain: "binance-smart-chain",
  dstTokenAmount: null,
  dstTokenPrice: 2,
  tx: null,
  txInfo: "txInfo",
  mimToUsd: 1000,
  dstChainId: 56,
};

describe("SendFromBlock.vue", () => {
  it("Should have correct computed properties if passed config has missing fields", () => {
    const wrapper = mount(SendFromBlock, {
      props: {
        config: missingFieldsConfig,
      },
    });
    expect(wrapper.vm.convertTokenAmount).toBe("<0.001 BSC");
    expect(wrapper.vm.originalTokenAmount).toBe("<0.001 ETH");
    expect(wrapper.vm.isNone).toBe(true);
    expect(wrapper.vm.fromScanUrl).toBe("");
    expect(wrapper.vm.sendFromCheck).toBe(
      useImage("assets/images/beam/check.png")
    );
    expect(wrapper.vm.destinationTokenAmount).toBe("0");
  });

  it("Should have correct computed properties if passed config is completely full", () => {
    const wrapper = mount(SendFromBlock, {
      props: {
        config: fullConfig,
      },
    });

    expect(wrapper.vm.convertTokenAmount).toBe("500.0 BSC");
    expect(wrapper.vm.originalTokenAmount).toBe("1000.0 ETH");
    expect(wrapper.vm.isNone).toBe(false);
    expect(wrapper.vm.sendFrom).toBe("0x00...000");
    expect(wrapper.vm.fromScanUrl).toBe("https://etherscan.io/tx/txHash");
    expect(wrapper.vm.sendFromCheck).toBe(
      useImage("assets/images/beam/complete.png")
    );
    expect(wrapper.vm.destinationTokenAmount).toBe("500.0");
  });
});
