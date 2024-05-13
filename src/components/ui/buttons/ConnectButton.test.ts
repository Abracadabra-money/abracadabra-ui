import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import ConnectButton from "@/components/ui/buttons/ConnectButton.vue";
import { testEmptyStore, testStore, getTestStore } from "@/test/store";

describe("ConnectButton", () => {
  it("renders the button text correctly when account is null", () => {
    const wrapper = shallowMount(ConnectButton, {
      global: { plugins: [testEmptyStore] },
    });

    expect(wrapper.find(".btn-text").text()).toBe("Connect wallet");
  });

  it("renders the button text correctly when account is not null", () => {
    const wrapper = shallowMount(ConnectButton, {
      global: { plugins: [testStore] },
    });

    expect(wrapper.find(".btn-text").text()).toBe("0xFFFF...FFFFFF");
  });

  it("renders the button text correctly when ensName is not null", () => {
    const store = getTestStore(1, "0x1234567890abcdef", "test.eth");
    const wrapper = shallowMount(ConnectButton, {
      global: { plugins: [store] },
    });

    expect(wrapper.find(".btn-text").text()).toBe("test.eth");
  });

  it("renders the button icon correctly", () => {
    const wrapper = shallowMount(ConnectButton, {
      global: { plugins: [testStore] },
    });

    expect(wrapper.find(".account-image").exists()).toBe(true);
  });
});
