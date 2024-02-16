import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import GmPriceImpact from "@/components/market/GmPriceImpact.vue";
import { gmArbTestConfig } from "@/test/gmArbTestConfig";

describe("GmPriceImpact", () => {
  it("renders the correct swap fee when actionType is ACTION_LEVERAGE", () => {
    const wrapper = shallowMount(GmPriceImpact, {
      props: { cauldronObject: gmArbTestConfig },
    });

    const swapFee = wrapper.find(".value").text();

    expect(swapFee).toBe("0");
  });
});
