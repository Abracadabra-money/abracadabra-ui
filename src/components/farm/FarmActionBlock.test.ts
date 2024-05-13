import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import FarmActionBlock from "@/components/farm/FarmActionBlock.vue";

describe("FarmActionBlock", () => {
  it("renders the component correctly", () => {
    const wrapper = shallowMount(FarmActionBlock, {
      propsData: {
        selectedFarm: { name: "Farm 1", stakingToken: { name: "Token 1" } },
        inputTitleText: "Input Title",
        max: BigInt(100),
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
        selectedFarm: { name: "Farm 1", stakingToken: { name: "Token 1" } },
        inputTitleText: "Input Title",
        max: BigInt(100),
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
        selectedFarm: { name: "Farm 1", stakingToken: { name: "Token 1" } },
        inputTitleText: "Input Title",
        max: BigInt(100),
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
        selectedFarm: { name: "Farm 1", stakingToken: { name: "Token 1" } },
        inputTitleText: "Input Title",
        max: BigInt(100),
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
