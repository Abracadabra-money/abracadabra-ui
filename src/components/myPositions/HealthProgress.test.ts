import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";

import HealthProgress from "@/components/myPositions/HealthProgress.vue";

describe("HealthProgress.vue", () => {
  it("Should have .safe class with no props passed", () => {
    const wrapper = mount(HealthProgress);
    const infoDiv = wrapper.find(".progress");
    expect(infoDiv.exists()).toBe(true);
    expect(infoDiv.classes()).toContain("safe");
  });

  it("Should have .safe class with such positionRisk prop", () => {
    const wrapper = mount(HealthProgress, {
      props: {
        positionRisk: "safe",
      },
    });
    const infoDiv = wrapper.find(".progress");
    expect(infoDiv.classes()).toContain("safe");
  });

  it("Should have .medium class with such positionRisk prop", () => {
    const wrapper = mount(HealthProgress, {
      props: {
        positionRisk: "medium",
      },
    });
    const infoDiv = wrapper.find(".progress");
    expect(infoDiv.classes()).toContain("medium");
  });

  it("Should have .high class with such positionRisk prop", () => {
    const wrapper = mount(HealthProgress, {
      props: {
        positionRisk: "high",
      },
    });
    const infoDiv = wrapper.find(".progress");
    expect(infoDiv.classes()).toContain("high");
  });
});
