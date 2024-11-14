import gsap from "gsap";
import { NORMAL_DURATION } from "@/helpers/useAnimation/constants";

export const scaleIn = (element: Element, done: () => void) => {
  gsap.to(element, {
    duration: NORMAL_DURATION,
    scale: 1,
    ease: "power1.in",
    onComplete: done,
  });
};
