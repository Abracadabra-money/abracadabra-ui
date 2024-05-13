import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { actionConfig } from "@/test/actionConfig";
import { magicGlpConfig } from "@/test/magicGlpConfig";
import PositionInfo from "@/components/market/PositionInfo.vue";

describe("PositionInfo", () => {
  it("renders the component", () => {
    const wrapper = shallowMount(PositionInfo, {
      props: {
        actionConfig,
        cauldron: magicGlpConfig,
        actionType: "borrow",
      },
    });

    expect(wrapper.exists()).toBe(true);
  });
});
