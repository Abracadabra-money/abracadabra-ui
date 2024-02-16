import { shallowMount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import WalletIcon from "@/components/ui/icons/WalletIcon.vue";

describe("WalletIcon", () => {
  it("renders with default props", () => {
    const wrapper = shallowMount(WalletIcon);
    expect(wrapper.props().width).toBe(16);
    expect(wrapper.props().height).toBe(16);
    expect(wrapper.props().fill).toBe("#7088CC");
  });

  it("renders with custom props", () => {
    const wrapper = shallowMount(WalletIcon, {
      propsData: {
        width: 20,
        height: 20,
        fill: "#FF0000",
      },
    });
    expect(wrapper.props().width).toBe(20);
    expect(wrapper.props().height).toBe(20);
    expect(wrapper.props().fill).toBe("#FF0000");
  });
});
