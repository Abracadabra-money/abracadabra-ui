import { describe, it, expect } from "vitest";
import { mount, shallowMount } from "@vue/test-utils";
import BaseButton from "@/components/base/BaseButton.vue";
import ConnectWalletBlock from "@/components/myPositions/ConnectWalletBlock.vue";

describe("ConnectWalletBlock", () => {
  it("should render an image with the correct source and alt text", () => {
    const wrapper = shallowMount(ConnectWalletBlock);
    const image = wrapper.find(".icon");

    expect(image.attributes("src")).toBe(
      "/src/assets/images/myPositions/connect-wallet.png"
    );
    expect(image.attributes("alt")).toBe("Empty icon");
  });

  it("should render a BaseButton component with the correct text and primary prop", () => {
    const wrapper = mount(ConnectWalletBlock);
    const button = wrapper.findComponent(BaseButton);

    expect(button.text()).toBe("Connect wallet");
    expect(button.props("primary")).toBe(true);
  });
});
