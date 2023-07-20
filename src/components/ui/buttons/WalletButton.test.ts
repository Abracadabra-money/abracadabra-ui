import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import WalletButton from "@/components/ui/buttons/WalletButton.vue";

describe("WalletButton.vue", () => {
  const wrapper: any = mount(WalletButton);

  it("Should render without props with no 'active' class", async () => {
    const walletBtn = wrapper.find(".wallet-btn");
    expect(walletBtn.exists()).toBe(true);
    expect(walletBtn.classes("active")).toBe(false);
  });

  it("Should render with props and set 'active' class depends on it", async () => {
    await wrapper.setProps({ active: false });
    expect(wrapper.classes("active")).toBe(false);

    await wrapper.setProps({ active: true });
    expect(wrapper.classes()).toContain("active");
  });
});
