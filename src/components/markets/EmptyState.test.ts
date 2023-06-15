import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import EmptyState from "@/components/markets/EmptyState.vue";

const testText = "Test string";

describe("EmptyState.vue", () => {
  it("Should render default string without props passed", () => {
    const wrapper = mount(EmptyState);
    const stateText = wrapper.find("p.state-text");
    expect(stateText.text()).toBe(
      "No pools on this network. In the future they will be displayed here"
    );
  });

  it("Should render default string without props passed", () => {
    const wrapper = mount(EmptyState, { props: { text: testText } });
    const stateText = wrapper.find("p.state-text");
    expect(stateText.text()).toBe(testText);
  });
});
