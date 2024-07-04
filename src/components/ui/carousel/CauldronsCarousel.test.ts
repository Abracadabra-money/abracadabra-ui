import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { Carousel, Slide, Pagination } from "vue3-carousel";
import CamelotCard from "@/components/cauldrons/promoCards/CamelotCard.vue";
import EmpowerCard from "@/components/cauldrons/promoCards/EmpowerCard.vue";
import CrvUsdMimCard from "@/components/cauldrons/promoCards/CrvUsdMimCard.vue";
import CamelotUsdcMimCard from "@/components/cauldrons/promoCards/CamelotUsdcMimCard.vue";

describe("Carousel", () => {
  it("renders the correct number of slides", () => {
    const wrapper = mount(Carousel, {
      props: {
        wrapAround: true,
        transition: 500,
        autoplay: 3000,
        breakpoints: {
          375: {
            itemsToShow: 1,
          },
          768: {
            itemsToShow: 2,
          },
          950: {
            itemsToShow: 3,
          },
          1350: {
            itemsToShow: 3,
          },
        },
      },
      slots: {
        default: `
                    <slide :index="1">
                        <CrvUsdMimCard />
                    </slide>
                    <slide :index="1">
                        <CamelotCard />
                    </slide>
                    <slide :index="1">
                        <EmpowerCard />
                    </slide>
                    <slide :index="1">
                        <CamelotUsdcMimCard />
                    </slide>
                `,
        addons: "<pagination />",
      },
      global: {
        components: {
          Slide,
          Pagination,
          CrvUsdMimCard,
          CamelotCard,
          EmpowerCard,
          CamelotUsdcMimCard,
        },
      },
    });

    const slides = wrapper.findAllComponents(Slide);

    expect(slides.length).toBe(12);
  });
});
