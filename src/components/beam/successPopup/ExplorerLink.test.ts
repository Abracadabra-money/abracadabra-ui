import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ExplorerLink from "@/components/beam/successPopup/ExplorerLink.vue";
import BaseLoader from "@/components/base/BaseLoader.vue";

describe("ExplorerLink.vue", () => {
  it("Should render default 'Explorer' title", () => {
    const wrapper = mount(ExplorerLink, {
      props: {
        link: "https://abracadabra.money/",
      },
    });
    const stateText = wrapper.find("a.link");
    expect(stateText.text()).toBe("Explorer");
  });

  it("Should render passed title correct", () => {
    const wrapper = mount(ExplorerLink, {
      props: {
        link: "https://abracadabra.money/",
        title: "Abracadabra",
      },
    });
    const stateText = wrapper.find("a.link");
    expect(stateText.text()).toBe("Abracadabra");
  });

  it("Should render BaseLoader if 'link' have not passed", () => {
    const wrapper = mount(ExplorerLink);
    expect(wrapper.findComponent(BaseLoader).exists()).toBe(true);
  });
});
