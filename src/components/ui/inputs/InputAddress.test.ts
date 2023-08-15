import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import InputAddress from "@/components/ui/inputs/InputAddress.vue";

describe("InputAddress.vue", () => {
  const wrapper = mount(InputAddress);

  it("Should render and calculate computed properties if address is null", () => {
    const inputAddress = wrapper.find(".input-address");
    expect(inputAddress.exists()).toBe(true);
    expect(wrapper.find(".error-message").isVisible()).toBe(true);

    expect(wrapper.vm.address).toBeNull();
    expect(wrapper.vm.checkInputAddress).toBe(false);
    expect(wrapper.vm.addressEntryError).toBe(false);
  });

  it("Should render and calculate computed properties if address is invalid", async () => {
    await wrapper.setData({ address: "0x" });
    expect(wrapper.find(".error-message").isVisible()).toBe(true);

    expect(wrapper.vm.address).toBe("0x");
    expect(wrapper.vm.checkInputAddress).toBe(false);
    expect(wrapper.vm.addressEntryError).toBe(true);
  });

  it("Should render and calculate computed properties if address is valid", async () => {
    await wrapper.setData({
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    });

    expect(wrapper.vm.address).toBe(
      "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    );
    expect(wrapper.vm.checkInputAddress).toBe(true);
    expect(wrapper.vm.addressEntryError).toBe(false);
  });

  it("Should emit value on changing", async () => {
    const inputAddress = wrapper.find(".input-address");
    const spy = vi.spyOn(wrapper.vm, "updateInput");
    inputAddress.trigger("input");
    expect(spy).toHaveBeenCalled();
    expect(wrapper.emitted()["update-input"][0]).toContain(
      "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    );
  });
});
