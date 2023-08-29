import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import TranchesStatistics from "@/components/stake/TranchesStatistics.vue";
import { stakeInfo } from "@/utils/testConfigs/stakeMagicLvl";

describe("TranchesStatistics.vue", async () => {
  const props = { stakeInfo };
  const wrapper = mount(TranchesStatistics, { props });
  const tokensIcon = wrapper.findAll("img");
  const tokensName = wrapper.findAll(".token-name");
  const tokensRisk = wrapper.findAll(".token-risk");
  const tokensApr = wrapper.findAll(".info-value");

  it("Should render Senior Tranche", async () => {
    expect(tokensIcon[0].attributes().src.includes("senior-icon.svg")).toBe(
      true
    );
    expect(tokensName[0].text()).toBe("Senior  Tranche");
    expect(tokensRisk[0].classes().includes("low")).toBe(true);
    expect(tokensApr[0].text()).toBe("34.92%");
    expect(tokensApr[1].text()).toBe("$ 23.83");
    expect(tokensApr[2].text()).toBe("$ 452.82");
  });

  it("Should render Mezzanine Tranche", async () => {
    expect(tokensIcon[0].attributes().src.includes("senior-icon.svg")).toBe(
      true
    );
    expect(tokensName[1].text()).toBe("Mezzanine  Tranche");
    expect(tokensRisk[1].classes().includes("medium")).toBe(true);
    expect(tokensApr[3].text()).toBe("111.91%");
    expect(tokensApr[4].text()).toBe("$ 338.08");
    expect(tokensApr[5].text()).toBe("$ 10,195.61");
  });

  it("Should render Junior Tranche", async () => {
    expect(tokensIcon[0].attributes().src.includes("senior-icon.svg")).toBe(
      true
    );
    expect(tokensName[2].text()).toBe("Junior  Tranche");
    expect(tokensRisk[2].classes().includes("high")).toBe(true);
    expect(tokensApr[6].text()).toBe("157.96%");
    expect(tokensApr[7].text()).toBe("$ 248.2");
    expect(tokensApr[8].text()).toBe("$ 6,922");
  });
});
