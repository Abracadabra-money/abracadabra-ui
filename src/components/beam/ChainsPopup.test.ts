import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import ChainsPopup from "@/components/beam/ChainsPopup.vue";

describe("ChainsPopup", () => {
  it("renders correctly when isOpen is true", () => {
    const wrapper = shallowMount(ChainsPopup, {
      propsData: {
        isOpen: true,
        networksArr: [
          { chainId: 1, icon: "icon1.png", title: "Chain 1" },
          { chainId: 2, icon: "icon2.png", title: "Chain 2" },
        ],
        activeChain: 1,
        popupType: "to",
        selectChain: true,
        currentChainId: 1,
      },
    });

    expect(wrapper.find(".popup").exists()).toBe(true);
    expect(wrapper.find(".title").text()).toBe("Select destination chain");
    expect(wrapper.findAll(".select-item")).toHaveLength(2);
  });

  it("emits closePopup event when closePopup method is called", () => {
    const wrapper = shallowMount(ChainsPopup);

    wrapper.vm.closePopup();

    expect(wrapper.emitted("closePopup")).toBeTruthy();
  });

  it("emits enterChain event with correct parameters when enterChain method is called", () => {
    const wrapper = shallowMount(ChainsPopup);

    wrapper.vm.enterChain(1);

    expect(wrapper.emitted("enterChain")).toBeTruthy();
    expect(wrapper.emitted("enterChain")![0]).toEqual([1, undefined]);
    expect(wrapper.emitted("closePopup")).toBeTruthy();
  });
});
