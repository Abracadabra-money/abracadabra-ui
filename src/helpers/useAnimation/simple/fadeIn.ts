import gsap from "gsap";
import { NORMAL_DURATION } from "@/helpers/useAnimation/constants";

export const fadeIn = (element: Element, done: () => void) => {
  gsap.to(element, {
    duration: NORMAL_DURATION,
    opacity: 1,
    ease: "power1.in",
    onComplete: done,
  });
};
