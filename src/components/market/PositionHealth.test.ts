import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import PositionHealth from "@/components/market/PositionHealth.vue";
import { magicGlpConfig } from "@/test/magicGlpConfig";

describe("PositionHealth", () => {
  it("renders the correct percent value", () => {
    const wrapper = shallowMount(PositionHealth, {
      propsData: {
        cauldron: magicGlpConfig,
      },
    });

    expect(wrapper.find(".position-percent").text()).toBe("0.0%");
  });
});
