import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import SettingsPopup from "@/components/borrow/SettingsPopup.vue";
import BaseButton from "@/components/base/BaseButton.vue";

const tooltip = vi.fn();

describe("SettingsPopup.vue", () => {
  it("Should render with no props have been passed", () => {
    const wrapper = mount(SettingsPopup, { directives: { tooltip } });
    const stnsPopup = wrapper.find(".settings-popup");
    expect(stnsPopup.exists()).toBe(true);
    expect(wrapper.vm.inputValue).toBe(1);
    expect(wrapper.find(".settings-input").attributes().placeholder).toBe(
      "Auto 1%"
    );
  });

  it("Should render if props have been passed", () => {
    const wrapper = mount(SettingsPopup, {
      props: { slippage: 5 },
      directives: { tooltip },
    });

    expect(wrapper.vm.inputValue).toBe(5);
    expect(wrapper.find(".settings-input").attributes().placeholder).toBe(
      "Auto 5%"
    );
  });

  it("Shold emit new slippage value on click", async () => {
    const wrapper = mount(SettingsPopup, {
      props: { slippage: 5 },
      directives: { tooltip },
    });

    const saveBtn = wrapper.findComponent(BaseButton);
    saveBtn.trigger("click");

    expect(wrapper.emitted()["saveSettings"][0]).toContain(5);

    await wrapper.find(".settings-input").setValue(10);
    expect(wrapper.vm.inputValue).toBe(10);
    saveBtn.trigger("click");

    expect(wrapper.emitted()["saveSettings"][1]).toContain(10);
  });
});
