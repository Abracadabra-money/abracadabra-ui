import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import { magicGlpConfig } from "@/test/magicGlpConfig";
import PositionHealth from "@/components/market/PositionHealth.vue";

const tooltip = vi.fn();

describe("PositionHealth", () => {
  it("renders the correct percent value", () => {
    const wrapper = shallowMount(PositionHealth, {
      propsData: {
        cauldron: magicGlpConfig,
      },
      directives: { tooltip },
    });

    expect(wrapper.find(".percent-value").text()).toBe("0%");
  });
});
