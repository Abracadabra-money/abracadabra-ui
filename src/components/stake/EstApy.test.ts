import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import EstApy from "@/components/stake/EstApy.vue";

describe("EmptyBlock.vue", async () => {
  it("Should render APY", async () => {
    const props = { apy: "3.18" };

    const wrapper = mount(EstApy, { props });

    expect(wrapper.find(".est-apy-percent").text()).toBe("3.18%");
  });

  it("Should render loader", async () => {
    const props = { apy: "" };

    const wrapper = mount(EstApy, { props });

    expect(wrapper.find(".est-apy-percent").exists()).toBe(false);
  });
});
