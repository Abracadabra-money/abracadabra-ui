import { testStore } from "@/test/store";
import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import ClaimButton from "@/components/ui/buttons/ClaimButton.vue";

describe("ClaimButton", () => {
  it("renders the button", () => {
    const wrapper = shallowMount(ClaimButton, {
      global: { plugins: [testStore] },
      props: {
        cauldron: {
          contracts: {
            collateral: {},
          },
          config: {
            collateralInfo: {
              decimals: 18,
            },
          },
        },
      },
      data() {
        return {
          reward: 100,
        };
      },
    });

    expect(wrapper.find(".claim-button").exists()).toBe(true);
  });
});
