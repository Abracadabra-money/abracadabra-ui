import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import LvlSpecialInfoBlock from "@/components/stake/magicLvl/LvlSpecialInfoBlock.vue";

describe("LvlSpecialInfoBlock", () => {
  const juniorLinkHref = "https://app.level.finance/liquidity/junior-tranche";
  const mezzanineLinkHref =
    "https://app.level.finance/liquidity/mezzanine-tranche";
  const seniorLinkHref = "https://app.level.finance/liquidity/senior-tranche";

  it("renders the component correctly", () => {
    const wrapper = shallowMount(LvlSpecialInfoBlock, {
      props: {
        activeToken: "senior",
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("displays the correct tranche links", () => {
    const wrapper = shallowMount(LvlSpecialInfoBlock, {
      props: {
        activeToken: "senior",
      },
    });

    const links = wrapper.find(".links-wrap").findAll("a");
    const juniorLink = links.at(0);
    const mezzanineLink = links.at(1);
    const seniorLink = links.at(2);

    if (juniorLink && juniorLink.element) {
      expect(juniorLink.attributes("href")).toBe(juniorLinkHref);
    }

    if (mezzanineLink && mezzanineLink.element) {
      expect(mezzanineLink.attributes("href")).toBe(mezzanineLinkHref);
    }

    if (seniorLink && seniorLink.element) {
      expect(seniorLink.attributes("href")).toBe(seniorLinkHref);
    }
  });
});
