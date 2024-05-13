import { testStore } from "@/test/store";
import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import BorrowForm from "@/components/market/BorrowForm.vue";
import { magicGlpConfig } from "@/test/magicGlpConfig";
import { actionConfig } from "@/test/actionConfig";

describe("BorrowForm", () => {
  it("renders correctly", () => {
    const wrapper = shallowMount(BorrowForm, {
      global: { plugins: [testStore] },
      props: {
        cauldron: magicGlpConfig,
        actionConfig: actionConfig,
      },
      computed: {
        cookValidationData() {
          return { isAllowed: true };
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("emits updateToggle event when native token is toggled", () => {
    const wrapper = shallowMount(BorrowForm, {
      global: { plugins: [testStore] },
      props: {
        cauldron: magicGlpConfig,
        actionConfig: actionConfig,
      },
      computed: {
        cookValidationData() {
          return { isAllowed: true };
        },
      },
    });

    wrapper.vm.onToggleNativeToken();

    expect(wrapper.emitted("updateToggle")).toBeTruthy();
    expect(wrapper.emitted("updateToggle")?.[0]).toEqual([
      "useNativeToken",
      true,
    ]);
  });
});
