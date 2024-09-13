import gsap from "gsap";
import { NORMAL_DURATION } from "@/constants/animations";

export const setRoll = (el: gsap.TweenTarget) => {
    gsap.set(el, { height: 0 });
}

export const rollDown = (el: gsap.TweenTarget, done: () => void) => {
    gsap.to(el, {
        duration: NORMAL_DURATION,
        height: "auto",
        ease: "power2.out",
        onComplete: done,
    });
}

export const rollUp = (el: gsap.TweenTarget, done: () => void) => {
    gsap.to(el, {
        duration: NORMAL_DURATION,
        height: 0,
        ease: "power2.out",
        onComplete: done,
    });
}