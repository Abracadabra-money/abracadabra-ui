import { testStore } from "@/test/store";
import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import NetworksList from "@/components/ui/NetworksList.vue";

describe("NetworksList", () => {
  it("renders the correct number of NetworkChip components", () => {
    const activeNetworks = [
      { chainId: 1, symbol: "ETH", icon: "eth.png" },
      { chainId: 2, symbol: "BSC", icon: "bsc.png" },
      { chainId: 3, symbol: "MATIC", icon: "matic.png" },
    ];

    const wrapper = shallowMount(NetworksList, {
      global: { plugins: [testStore] },
      propsData: {
        items: 4,
        activeList: [],
      },
      computed: {
        activeNetworks: () => activeNetworks,
      },
    });

    const networkChips = wrapper.findAllComponents({ name: "NetworkChip" });
    expect(networkChips.length).toBe(activeNetworks.length);
  });
});
