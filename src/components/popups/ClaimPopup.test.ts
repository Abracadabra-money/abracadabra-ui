import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import ClaimPopup from "@/components/popups/ClaimPopup.vue";

describe("ClaimPopup", () => {
  it("renders the popup header correctly", () => {
    const wrapper = shallowMount(ClaimPopup);
    const header = wrapper.find(".popup-header");
    expect(header.exists()).toBe(true);

    const title = header.find(".title");
    expect(title.text()).toBe("Important Notice");

    const closeButton = header.find(".close");
    expect(closeButton.exists()).toBe(true);
  });

  it("renders the popup content correctly", () => {
    const wrapper = shallowMount(ClaimPopup);
    const content = wrapper.find(".popup-content");
    expect(content.exists()).toBe(true);

    const textElements = content.findAll(".popup-text");
    expect(textElements.length).toBe(2);
    expect(textElements[0].text()).toBe(
      "Your address is affected by a Smart Contract Vulnerability."
    );
    expect(textElements[1].text()).toBe(
      "Follow the Steps here to get back your secured funds."
    );

    const link = content.find(".link");
    expect(link.exists()).toBe(true);
    expect(link.attributes("href")).toBe("http://");
    expect(link.attributes("target")).toBe("_blank");
    expect(link.attributes("rel")).toBe("noopener noreferrer");
    expect(link.text()).toBe("Read more about it here");
  });
});
