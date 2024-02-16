import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import MarketHead from "@/components/market/MarketHead.vue";
import { magicGlpConfig } from "@/test/magicGlpConfig";
import { testStore } from "@/test/store";

describe("MarketHead", () => {
  it("renders correctly", () => {
    const wrapper = shallowMount(MarketHead, {
      global: { plugins: [testStore] },
      props: {
        cauldron: magicGlpConfig,
      },
    });

    expect(wrapper.exists()).toBe(true);
  });
});
