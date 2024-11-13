import gsap from "gsap";
import { NORMAL_DURATION } from "@/helpers/useAnimation/constants";

export const fadeIn = (el: gsap.TweenTarget, done: () => void) => {
  gsap.to(el, {
    duration: NORMAL_DURATION,
    opacity: 1,
    ease: "power1.in",
    onComplete: done,
  });
};
