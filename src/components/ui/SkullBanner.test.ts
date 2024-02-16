import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import SkullBanner from "@/components/ui/SkullBanner.vue";

describe("SkullBanner", () => {
  it("renders the banner when showPopup is true and closeClicked is false", () => {
    const wrapper = shallowMount(SkullBanner, {
      computed: {
        showPopup() {
          return true;
        },
      },
    });

    expect(wrapper.find(".banner").exists()).toBe(true);
  });

  it("does not render the banner when showPopup is false", () => {
    const wrapper = shallowMount(SkullBanner, {
      computed: {
        showPopup() {
          return false;
        },
      },
    });

    expect(wrapper.find(".banner").exists()).toBe(false);
  });
});
