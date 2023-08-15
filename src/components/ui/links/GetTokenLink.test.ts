import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import GetTokenLink from "@/components/ui/links/GetTokenLink.vue";

const testData = { href: "//test_link", label: "test_link" };

describe("GetTokenLink.vue", () => {
  it("Should render correct", () => {
    const wrapper = mount(GetTokenLink, { props: { data: testData } });

    const getTokenLink = wrapper.find(".get-token-link");
    expect(getTokenLink.exists()).toBe(true);
    expect(getTokenLink.attributes().href).toBe("//test_link");
    expect(getTokenLink.text()).toBe("test_link");
  });
});
