import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SuccessPopup from "@/components/beam/successPopup/SuccessPopup.vue";
import SendFromBlock from "@/components/beam/successPopup/SendFromBlock.vue";
import SendToBlock from "@/components/beam/successPopup/SendToBlock.vue";
import TransactionProgressBlock from "@/components/beam/successPopup/TransactionProgressBlock.vue";
import filters from "@/filters";

const config = {
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

describe("SuccessPopup.vue", () => {
  it("Should render SendFromBlock, SendToBlock, TransactionProgressBlock", () => {
    const wrapper = mount(SuccessPopup, {
      props: {
        config: config,
      },
    });
    expect(wrapper.findComponent(SendFromBlock).exists()).toBe(true);
    expect(wrapper.findComponent(SendToBlock).exists()).toBe(true);
    expect(wrapper.findComponent(TransactionProgressBlock).exists()).toBe(true);
  });
});
