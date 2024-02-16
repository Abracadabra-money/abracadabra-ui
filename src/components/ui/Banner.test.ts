import Vuex from "vuex";
import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import Banner from "@/components/ui/Banner.vue";
import { createRouter, createWebHistory } from "vue-router";

const store = new Vuex.Store({
  modules: {
    connectProvider: {
      state: {
        chainId: 1,
      },
      getters: {
        getChainId: (state) => state.chainId,
      },
    },
  },
});

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: "/", component: Banner }],
});

describe("Banner", () => {
  it("renders the banner when showBanner is true and closeClicked is false", () => {
    const wrapper = shallowMount(Banner, {
      data() {
        return {
          closeClicked: false,
        };
      },
      computed: {
        showBanner() {
          return true;
        },
      },
      global: {
        plugins: [store, router],
      },
    });

    expect(wrapper.find(".banner").exists()).toBe(true);
  });

  it("does not render the banner when showBanner is false", () => {
    const wrapper = shallowMount(Banner, {
      data() {
        return {
          closeClicked: false,
        };
      },
      global: {
        plugins: [store, router],
      },
    });

    expect(wrapper.find(".banner").exists()).toBe(false);
  });

  it("does not render the banner when closeClicked is true", () => {
    const wrapper = shallowMount(Banner, {
      data() {
        return {
          closeClicked: true,
        };
      },
      computed: {
        showBanner() {
          return true;
        },
      },
      global: {
        plugins: [store, router],
      },
    });

    expect(wrapper.find(".banner").exists()).toBe(false);
  });

  it("calls the closeBanner method when the close button is clicked", () => {
    const wrapper = shallowMount(Banner, {
      data() {
        return {
          closeClicked: false,
        };
      },
      computed: {
        showBanner() {
          return true;
        },
      },
      global: {
        plugins: [store, router],
      },
    });
    const closeButton = wrapper.find(".banner-close");

    closeButton.trigger("click");

    expect(wrapper.vm.closeClicked).toBe(true);
  });
});
