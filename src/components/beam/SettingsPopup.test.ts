import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import SettingsPopup from "@/components/beam/SettingsPopup.vue";
import { useImage } from "@/helpers/useImage";

const config = {
  address: "0xFF325aF9D13baF1eC655CAD7A92663632439163d",
  icon: useImage("assets/images/tokens/AVAX.png"),
  nativeSymbol: "FTM",
  nativeTokenBalance: "0.58381987290380852",
};

describe("ExpectedBlock.vue", () => {
  it("Should save button must be active", () => {
    const wrapper = mount(SettingsPopup, {
      props: {
        config,
        max: 18.47,
        defaultValue: "0.009609676187498731",
        value: 1,
      },
    });

    expect(wrapper.vm.isDisabledBtn).toBe(false);
  });

  it("Should save button must be disabled", () => {
    const wrapper = mount(SettingsPopup, {
      props: {
        config,
        max: 18.47,
        defaultValue: "0.009609676187498731",
        value: "",
      },
    });

    expect(wrapper.vm.isDisabledBtn).toBe(true);
  });

  it("Should render error max value", () => {
    const wrapper = mount(SettingsPopup, {
      props: {
        config,
        max: 18.47,
        defaultValue: "0.009609676187498731",
        value: 20,
      },
    });
    wrapper.vm.$data.fee = 947.901333149714;
    console.log("error", wrapper.vm.error);

    expect(wrapper.vm.error).toBe("Error max value 18.47");
  });

  it("Should render error not enough gas", () => {
    const wrapper = mount(SettingsPopup, {
      props: {
        config,
        max: 18.47,
        defaultValue: "0.009609676187498731",
        value: 10,
      },
    });

    wrapper.vm.$data.fee = 947.901333149714;
    expect(wrapper.vm.error).toBe(
      "Not enough gas 947.3175132768101 FTM needed"
    );
  });
});
