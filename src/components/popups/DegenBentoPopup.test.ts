import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import BaseButton from "@/components/base/BaseButton.vue";
import DegenBentoPopup from "@/components/popups/DegenBentoPopup.vue";

describe("DegenBentoPopup", () => {
  it("renders correctly", () => {
    const wrapper = shallowMount(DegenBentoPopup, {
      props: {
        infoObject: {
          chainId: 1,
          tokenInfo: {
            address: "0x1234567890",
            abi: [],
          },
          bentoContractInfo: {
            address: "0x9876543210",
            abi: [],
          },
          degenContractInfo: {
            address: "0x0987654321",
            abi: [],
          },
          bentoAllowance: 100,
          degenAllowance: 200,
          mimBalance: 500,
          mimInBentoBalance: 300,
          mimInDegenBalance: 400,
        },
        isBento: true,
        isDeposit: false,
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".backdrop").exists()).toBe(true);
    expect(wrapper.find(".box-popup").exists()).toBe(true);
    expect(wrapper.find(".box-header").exists()).toBe(true);
    expect(wrapper.find(".title").exists()).toBe(true);
    expect(wrapper.find(".close-img").exists()).toBe(true);
    expect(wrapper.find(".description").exists()).toBe(true);
    expect(wrapper.find(".withdraw-input").exists()).toBe(true);
    expect(wrapper.findComponent(BaseButton).exists()).toBe(true);
  });

  it('emits "close" event when closePopup is called', () => {
    const wrapper = shallowMount(DegenBentoPopup, {
      props: {
        infoObject: {
          chainId: 1,
          tokenInfo: {
            address: "0x1234567890",
            abi: [],
          },
          bentoContractInfo: {
            address: "0x9876543210",
            abi: [],
          },
          degenContractInfo: {
            address: "0x0987654321",
            abi: [],
          },
          bentoAllowance: 100,
          degenAllowance: 200,
          mimBalance: 500,
          mimInBentoBalance: 300,
          mimInDegenBalance: 400,
        },
        isBento: true,
        isDeposit: false,
      },
    });

    wrapper.vm.closePopup();

    expect(wrapper.emitted("close")).toBeTruthy();
  });
});
