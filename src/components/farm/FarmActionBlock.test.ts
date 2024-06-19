import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import FarmActionBlock from "@/components/farm/FarmActionBlock.vue";
import { emptyFarmData } from "@/helpers/farm/createFarmData";
import type { Address } from "viem";

const farm = {
  ...emptyFarmData,
  config: {
    name: "",
    icon: "",
    contractChain: 1,
    id: 0,
    stakingToken: {
      name: "Token 1",
      type: "",
      link: "",
      abi: [],
    },
    contract: {
      name: "",
      address: "0x00000" as Address,
      abi: [],
    },
  },
};

describe("FarmActionBlock", () => {
  it("renders the component correctly", () => {
    const wrapper = shallowMount(FarmActionBlock, {
      propsData: {
        selectedFarm: farm,
        inputTitleText: "Input Title",
        max: 100n,
        error: "",
        value: "",
        isButtonDisabled: false,
        buttonText: "Submit",
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("emits the updateValue event when the input value is updated", () => {
    const wrapper = shallowMount(FarmActionBlock, {
      propsData: {
        selectedFarm: farm,
        inputTitleText: "Input Title",
        max: 100n,
        error: "",
        value: "",
        isButtonDisabled: false,
        buttonText: "Submit",
      },
    });

    const input = wrapper.findComponent({ name: "BaseTokenInput" });
    input.vm.$emit("updateInputValue", "New Value");

    expect(wrapper.emitted("updateValue")).toBeTruthy();
    expect(wrapper.emitted("updateValue")![0][0]).toBe("New Value");
  });

  it("disables the button when isButtonDisabled prop is true", () => {
    const wrapper = shallowMount(FarmActionBlock, {
      propsData: {
        selectedFarm: farm,
        inputTitleText: "Input Title",
        max: 100n,
        error: "",
        value: "",
        isButtonDisabled: true,
        buttonText: "Submit",
      },
    });

    const button = wrapper.findComponent({ name: "BaseButton" });
    expect(button.props("disabled")).toBe(true);
  });

  it("enables the button when isButtonDisabled prop is false", () => {
    const wrapper = shallowMount(FarmActionBlock, {
      propsData: {
        selectedFarm: farm,
        inputTitleText: "Input Title",
        max: 100n,
        error: "",
        value: "",
        isButtonDisabled: false,
        buttonText: "Submit",
      },
    });

    const button = wrapper.findComponent({ name: "BaseButton" });
    expect(button.props("disabled")).toBe(false);
  });
});
