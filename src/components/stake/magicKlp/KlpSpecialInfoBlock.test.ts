import { describe, it, expect } from "vitest";
import { mount, shallowMount } from "@vue/test-utils";
import GetTokenLink from "@/components/ui/links/GetTokenLink.vue";
import KlpSpecialInfoBlock from "@/components/stake/magicKlp/KlpSpecialInfoBlock.vue";

describe("KlpSpecialInfoBlock", () => {
  const BUY_LINK = "https://perps.kinetix.finance/#/liquidity";
  const SELL_LINK = "https://perps.kinetix.finance/#/liquidity#redeem";

  it("renders the component", () => {
    const wrapper = shallowMount(KlpSpecialInfoBlock);
    expect(wrapper.exists()).toBe(true);
  });

  it("displays the title", () => {
    const wrapper = shallowMount(KlpSpecialInfoBlock);
    const title = wrapper.find(".title");
    expect(title.text()).toBe("Simply deposit your KLP");
  });

  it("displays the links", () => {
    const wrapper = mount(KlpSpecialInfoBlock, {
      globals: {
        components: { GetTokenLink },
      },
    });

    const links = wrapper.findAll(".links-wrap a");

    expect(links.length).toBe(2);

    const buyLink = links[0];
    expect(buyLink.attributes("href")).toBe(BUY_LINK);
    expect(buyLink.text()).toBe("Buy KLP");

    const sellLink = links[1];

    expect(sellLink.attributes("href")).toBe(SELL_LINK);
    expect(sellLink.text()).toBe("Sell KLP");
  });

  it("displays the text paragraphs", () => {
    const wrapper = shallowMount(KlpSpecialInfoBlock);
    const paragraphs = wrapper.findAll(".text");
    expect(paragraphs.length).toBe(2);

    const firstParagraph = paragraphs[0];
    expect(firstParagraph.text()).toBe(
      "Enjoy the benefits of compounding without having to worry about the tedious work! Simply deposit your KLP into MagicKLP and let it do its magic!"
    );

    const secondParagraph = paragraphs[1];
    expect(secondParagraph.text()).toBe(
      "Note: A 1% protocol fee is taken on the yields."
    );
  });
});
