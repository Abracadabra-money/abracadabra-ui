import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import HeaderStakeMobilePopup from "@/components/popups/HeaderStakeMobilePopup.vue";

describe("HeaderStakeMobilePopup", () => {
  it("renders correctly", () => {
    const wrapper = shallowMount(HeaderStakeMobilePopup);
    expect(wrapper.exists()).toBe(true);
  });

  it('emits "closePopup" event when popup header is clicked', () => {
    const wrapper = shallowMount(HeaderStakeMobilePopup);
    wrapper.find(".popup-header").trigger("click");
    expect(wrapper.emitted("closePopup")).toBeTruthy();
  });

  it('emits "closeMobileMenu" event when router-link is clicked', () => {
    const wrapper = shallowMount(HeaderStakeMobilePopup);
    const routerLink = wrapper.find("router-link");
    routerLink.trigger("click");
    expect(wrapper.emitted("closeMobileMenu")).toBeTruthy();
  });
});
