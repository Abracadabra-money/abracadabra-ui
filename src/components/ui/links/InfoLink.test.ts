import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import InfoLink from "@/components/ui/links/InfoLink.vue";

const testTooltipText = "tooltip_text";
const testText = "test_link_text";
const testHref = "//test_link";

const tooltip = vi.fn();

describe("InfoLink.vue", () => {
  it("Should render correct with no props passed", () => {
    const wrapper = mount(InfoLink, { directives: { tooltip } });

    const infoLink = wrapper.find(".info-link");
    expect(infoLink.exists()).toBe(true);
    expect(infoLink.attributes().href).toBe("#");
    expect(infoLink.text()).toBe("Link");
    expect(wrapper.vm.tooltip).toBe("");
  });

  it("Should render correct with props passed", () => {
    const wrapper = mount(InfoLink, {
      props: { tooltip: testTooltipText, text: testText, href: testHref },
      directives: { tooltip },
    });

    const infoLink = wrapper.find(".info-link");
    expect(infoLink.attributes().href).toBe("//test_link");
    expect(infoLink.text()).toBe("test_link_text");
    expect(wrapper.vm.tooltip).toBe("tooltip_text");
  });
});
