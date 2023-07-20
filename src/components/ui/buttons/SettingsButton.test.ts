import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import SettingsButton from "@/components/ui/buttons/SettingsButton.vue";

describe("SettingsButton.vue", () => {
  const wrapper: any = mount(SettingsButton);

  it("Should render without props with no 'active' class", async () => {
    const settingsBtn = wrapper.find(".settings-btn");
    expect(settingsBtn.exists()).toBe(true);
    expect(settingsBtn.classes("active")).toBe(false);
  });

  it("Should render with props and set 'active' class depends on it", async () => {
    await wrapper.setProps({ active: false });
    const settingsBtn = wrapper.find(".settings-btn");
    expect(settingsBtn.classes("active")).toBe(false);

    await wrapper.setProps({ active: true });
    expect(settingsBtn.classes()).toContain("active");
  });
});
