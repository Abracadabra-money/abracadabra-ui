import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import SettingsPopup from "@/components/beam/SettingsPopup.vue";

describe("SettingsPopup", () => {
  it("renders correctly", () => {
    const wrapper = shallowMount(SettingsPopup, {
      propsData: {
        value: 0,
        mimAmount: 0,
        config: {
          icon: "icon.png",
          symbol: "MIM",
          nativeTokenBalance: 100,
          nativeSymbol: "ETH",
        },
        max: 100,
        defaultValue: "0",
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("updates input value correctly", () => {
    const wrapper = shallowMount(SettingsPopup, {
      propsData: {
        value: 0,
        mimAmount: 0,
        config: {
          icon: "icon.png",
          symbol: "MIM",
          nativeTokenBalance: 100,
          nativeSymbol: "ETH",
        },
        max: 100,
        defaultValue: "0",
      },
    });

    wrapper.vm.updateInputValue(50);

    expect(wrapper.vm.inputValue).toBe(50);
  });

  it("checks if isDefaultValue returns true when inputValue is equal to defaultValue", () => {
    const wrapper = shallowMount(SettingsPopup, {
      propsData: {
        value: 0,
        mimAmount: 0,
        config: {
          icon: "icon.png",
          symbol: "MIM",
          nativeTokenBalance: 100,
          nativeSymbol: "ETH",
        },
        max: 100,
        defaultValue: "0",
      },
    });

    wrapper.vm.updateInputValue("0");

    expect(wrapper.vm.isDefaultValue).toBe(true);
  });

  it("checks if isNone returns true when inputValue is equal to 0", () => {
    const wrapper = shallowMount(SettingsPopup, {
      propsData: {
        value: 0,
        mimAmount: 0,
        config: {
          icon: "icon.png",
          symbol: "MIM",
          nativeTokenBalance: 100,
          nativeSymbol: "ETH",
        },
        max: 100,
        defaultValue: "0",
      },
    });

    wrapper.vm.updateInputValue(0);

    expect(wrapper.vm.isNone).toBe(true);
  });

  it("checks if isDisabledBtn returns true when inputValue is empty", () => {
    const wrapper = shallowMount(SettingsPopup, {
      propsData: {
        value: 0,
        mimAmount: 0,
        config: {
          icon: "icon.png",
          symbol: "MIM",
          nativeTokenBalance: 100,
          nativeSymbol: "ETH",
        },
        max: 100,
        defaultValue: "0",
      },
    });

    wrapper.vm.updateInputValue("");

    expect(wrapper.vm.isDisabledBtn).toBe(true);
  });

  it("checks if error returns the correct error message when inputValue is greater than max", () => {
    const wrapper = shallowMount(SettingsPopup, {
      propsData: {
        value: 0,
        mimAmount: 0,
        config: {
          icon: "icon.png",
          symbol: "MIM",
          nativeTokenBalance: 100,
          nativeSymbol: "ETH",
        },
        max: 100,
        defaultValue: "0",
      },
    });

    wrapper.vm.updateInputValue(150);

    expect(wrapper.vm.error).toBe("Error max value 100");
  });

  it("checks if error returns the correct error message when fee is greater than nativeTokenBalance and inputValue is not empty", () => {
    const wrapper = shallowMount(SettingsPopup, {
      propsData: {
        value: 0,
        mimAmount: 0,
        config: {
          icon: "icon.png",
          symbol: "MIM",
          nativeTokenBalance: 100,
          nativeSymbol: "ETH",
        },
        max: 100,
        defaultValue: "0",
      },
    });

    wrapper.vm.updateInputValue(10);
    wrapper.setData({ fee: 150 });

    expect(wrapper.vm.error).toBe("Not enough gas 50 ETH needed");
  });

  it("checks if error returns false when inputValue is valid", () => {
    const wrapper = shallowMount(SettingsPopup, {
      propsData: {
        value: 0,
        mimAmount: 0,
        config: {
          icon: "icon.png",
          symbol: "MIM",
          nativeTokenBalance: 100,
          nativeSymbol: "ETH",
        },
        max: 100,
        defaultValue: "0",
      },
    });

    wrapper.vm.updateInputValue(50);

    expect(wrapper.vm.error).toBe(false);
  });
});
