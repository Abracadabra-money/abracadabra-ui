import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import TransactionProgressBlock from "@/components/beam/successPopup/TransactionProgressBlock.vue";

describe("TransactionProgressBlock", () => {
  it("renders the transaction status correctly", () => {
    const config = {
      txInfo: {
        status: "INFLIGHT",
      },
      tx: {
        hash: "transaction-hash",
      },
    };

    const wrapper = shallowMount(TransactionProgressBlock, {
      propsData: {
        config,
      },
    });

    expect(wrapper.find(".title").text()).toBe("Transaction status");
    expect(wrapper.find(".progress-indicator").text()).toBe("processing");
    expect(wrapper.find(".description .text").text()).toBe(
      "You may see it in the"
    );
    expect(wrapper.findComponent({ name: "ExplorerLink" }).props("link")).toBe(
      "https://layerzeroscan.com/tx/transaction-hash"
    );
  });

  it("renders the completed status correctly", () => {
    const config = {
      txInfo: {
        status: "COMPLETED",
      },
      tx: {
        hash: "transaction-hash",
      },
    };

    const wrapper = shallowMount(TransactionProgressBlock, {
      propsData: {
        config,
      },
    });

    expect(wrapper.find(".progress-indicator").text()).toBe("completed");
    expect(wrapper.find(".progress-indicator").classes()).toContain(
      "completed"
    );
    expect(wrapper.findComponent({ name: "ExplorerLink" }).props("link")).toBe(
      "https://layerzeroscan.com/tx/transaction-hash"
    );
  });

  it("renders the processing status correctly", () => {
    const config = {
      tx: {
        hash: "transaction-hash",
      },
    };

    const wrapper = shallowMount(TransactionProgressBlock, {
      propsData: {
        config,
      },
    });

    expect(wrapper.find(".progress-indicator").text()).toBe("processing");
    expect(wrapper.find(".progress-indicator").classes()).toContain(
      "processing"
    );
    expect(wrapper.findComponent({ name: "ExplorerLink" }).props("link")).toBe(
      "https://layerzeroscan.com/tx/transaction-hash"
    );
  });
});
