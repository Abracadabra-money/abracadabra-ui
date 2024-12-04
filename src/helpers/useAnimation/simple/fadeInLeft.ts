import gsap from "gsap";
import { NORMAL_DURATION } from "@/helpers/useAnimation/constants";

export const fadeInLeft = (element: Element, done: () => void) => {
  gsap.to(element, {
    duration: NORMAL_DURATION,
    opacity: 1,
    x: "0%",
    ease: "power1.in",
    onComplete: done,
  });
};
