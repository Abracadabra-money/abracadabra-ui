import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import { magicGlpConfig } from "@/test/magicGlpConfig";
import MimLeftToBorrow from "@/components/market/MimLeftToBorrow.vue";

describe("MimLeftToBorrow", () => {
  it("renders the correct mimLeftToBorrow value", () => {
    const wrapper = shallowMount(MimLeftToBorrow, {
      propsData: {
        cauldron: magicGlpConfig,
      },
      mounted() {
        vi.fn();
      },
    });

    expect(wrapper.find(".value").text()).toBe("100");
  });

  it("renders the correct totalMimToBorrow value", () => {
    const wrapper = shallowMount(MimLeftToBorrow, {
      propsData: {
        cauldron: magicGlpConfig,
      },
      mounted() {
        vi.fn();
      },
    });

    expect(wrapper.find(".value-end").text()).toBe("1M");
  });

  it("calls initAnimation method on mounted", () => {
    const wrapper = shallowMount(MimLeftToBorrow, {
      propsData: {
        cauldron: magicGlpConfig,
      },
    });

    const initAnimationSpy = vi.spyOn(wrapper.vm, "initAnimation");
    wrapper.vm.$options.mounted?.call(wrapper.vm);

    expect(initAnimationSpy).toHaveBeenCalled();
  });
});
