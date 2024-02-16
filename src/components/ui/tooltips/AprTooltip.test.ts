import { shallowMount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import AprTooltip from "@/components/ui/tooltips/AprTooltip.vue";

describe("AprTooltip", () => {
  it("renders correctly", () => {
    const wrapper = shallowMount(AprTooltip, {
      props: {
        farm: {
          tokensApr: [
            { address: "0x123", apr: 0.05 },
            { address: "0x456", apr: 0.1 },
          ],
          config: {
            rewardTokens: [
              { address: "0x123", icon: "token1.png" },
              { address: "0x456", icon: "token2.png" },
            ],
          },
          farmRoi: 0.15,
        },
        top: false,
      },
    });

    expect(wrapper.exists()).toBe(true);
    // Add more assertions to test the rendered output
  });

  // Add more test cases as needed
});
