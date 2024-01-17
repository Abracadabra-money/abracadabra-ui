import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import SuccessPopup from "@/components/beam/successPopup/SuccessPopup.vue";
import BeamProcess from "@/components/beam/successPopup/BeamProcess.vue";
import BeamInfo from "@/components/beam/successPopup/BeamInfo.vue";
import TransactionProgressBlock from "@/components/beam/successPopup/TransactionProgressBlock.vue";
describe("SuccessPopup", () => {
  it("renders the correct components", () => {
    const config = {};

    const wrapper = shallowMount(SuccessPopup, {
      propsData: {
        config,
      },
      components: {
        BeamProcess,
        BeamInfo,
        TransactionProgressBlock,
      },
    });

    expect(wrapper.findComponent(BeamProcess).exists()).toBe(true);
    expect(wrapper.findComponent(BeamInfo).exists()).toBe(true);
    expect(wrapper.findComponent(TransactionProgressBlock).exists()).toBe(true);
  });

  it('emits "close-popup" event when backdrop is clicked', () => {
    const config = {};

    const wrapper = shallowMount(SuccessPopup, {
      propsData: {
        config,
      },
      components: {
        BeamProcess,
        BeamInfo,
        TransactionProgressBlock,
      },
    });

    wrapper.find(".backdrop").trigger("click");

    expect(wrapper.emitted("close-popup")).toBeTruthy();
  });

  it('emits "close-popup" event when close button is clicked', () => {
    const config = {};

    const wrapper = shallowMount(SuccessPopup, {
      propsData: {
        config,
      },
      components: {
        BeamProcess,
        BeamInfo,
        TransactionProgressBlock,
      },
    });

    wrapper.find(".popup-close").trigger("click");

    expect(wrapper.emitted("close-popup")).toBeTruthy();
  });
});
