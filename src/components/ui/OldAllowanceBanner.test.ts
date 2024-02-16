import { testStore } from "@/test/store";
import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import OldAllowanceBanner from "@/components/ui/OldAllowanceBanner.vue";

describe("OldAllowanceBanner", () => {
  it("renders the banner when showBanner is true and closeClicked is false", () => {
    const wrapper = shallowMount(OldAllowanceBanner, {
      global: { plugins: [testStore] },
      data() {
        return {
          closeClicked: false,
          isStillApproved: true,
          isMoreThanOneApproval: true,
        };
      },
    });

    expect(wrapper.find(".banner").exists()).toBe(true);
  });

  it("does not render the banner when showBanner is false", () => {
    const wrapper = shallowMount(OldAllowanceBanner, {
      global: { plugins: [testStore] },
      data() {
        return {
          closeClicked: false,
          isStillApproved: false,
          isMoreThanOneApproval: false,
        };
      },
    });

    expect(wrapper.find(".banner").exists()).toBe(false);
  });

  it("calls openPopup method when banner link is clicked", () => {
    const wrapper = shallowMount(OldAllowanceBanner, {
      global: { plugins: [testStore] },
      data() {
        return {
          closeClicked: false,
          isStillApproved: true,
          isMoreThanOneApproval: true,
        };
      },
    });

    const openPopupSpy = vi.spyOn(wrapper.vm, "openPopup");

    wrapper.find(".banner-link").trigger("click");

    expect(openPopupSpy).toHaveBeenCalled();
  });
});
