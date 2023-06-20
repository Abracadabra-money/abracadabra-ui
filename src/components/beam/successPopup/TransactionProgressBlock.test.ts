import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import TransactionProgressBlock from "@/components/beam/successPopup/TransactionProgressBlock.vue";
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

describe("TransactionProgressBlock.vue", () => {
  it("Should have correct computed properties if passed config is completely full ", () => {
    const wrapper = mount(TransactionProgressBlock, {
      props: {
        config: fullConfig,
      },
    });
    expect(wrapper.vm.isTxComplete).toBe(true);
    expect(wrapper.vm.transactionCheck).toBe(
      useImage("assets/images/beam/transaction-complete.png")
    );
    expect(wrapper.vm.transactionText).toBe("complete");
    expect(wrapper.vm.layerZeroLink).toBe(
      "https://layerzeroscan.com/tx/txHash"
    );
  });

  it("Should have correct computed properties if passed config config has missing fields ", () => {
    const wrapper = mount(TransactionProgressBlock, {
      props: {
        config: missingFieldsConfig,
      },
    });
    expect(wrapper.vm.isTxComplete).toBe(false);
    expect(wrapper.vm.transactionCheck).toBe(
      useImage("assets/images/beam/transaction-check.png")
    );
    expect(wrapper.vm.transactionText).toBe("processing");
    expect(wrapper.vm.layerZeroLink).toBe(false);
  });
});
