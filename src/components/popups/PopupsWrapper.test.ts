import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import PopupsWrapper from "@/components/popups/PopupsWrapper.vue";

describe("PopupsWrapper", () => {
  it('renders CrvStakePopup when popupActiveType is "3crv"', () => {
    const wrapper = shallowMount(PopupsWrapper, {
      computed: {
        popupActiveType: () => "3crv",
      },
    });

    expect(wrapper.findComponent({ name: "CrvStakePopup" }).exists()).toBe(
      true
    );
  });

  it('renders SucessPopup when popupActiveType is "success"', () => {
    const wrapper = shallowMount(PopupsWrapper, {
      computed: {
        popupActiveType: () => "success",
      },
    });

    expect(wrapper.findComponent({ name: "SucessPopup" }).exists()).toBe(true);
  });

  it('renders ClaimPopup when popupActiveType is "claim"', () => {
    const wrapper = shallowMount(PopupsWrapper, {
      computed: {
        popupActiveType: () => "claim",
      },
    });

    expect(wrapper.findComponent({ name: "ClaimPopup" }).exists()).toBe(true);
  });

  it('renders RouteOptimisationPopup when popupActiveType is "mglp-route"', () => {
    const wrapper = shallowMount(PopupsWrapper, {
      computed: {
        popupActiveType: () => "mglp-route",
      },
    });

    expect(
      wrapper.findComponent({ name: "RouteOptimisationPopup" }).exists()
    ).toBe(true);
  });

  it('renders ApprovalsPopup when popupActiveType is "approvals"', () => {
    const wrapper = shallowMount(PopupsWrapper, {
      computed: {
        popupActiveType: () => "approvals",
      },
    });

    expect(wrapper.findComponent({ name: "ApprovalsPopup" }).exists()).toBe(
      true
    );
  });
});
