import gsap from "gsap";
import { NORMAL_DURATION } from "@/constants/animations";

export const setFade = (el: gsap.TweenTarget) => {
    gsap.set(el, { opacity: 0 });
}

export const fadeIn = (el: gsap.TweenTarget, done: () => void) => {
    gsap.to(el, {
        duration: NORMAL_DURATION,
        opacity: 1,
        ease: 'power1.in',
        onComplete: done
    });
}

export const fadeOut = (el: gsap.TweenTarget, done: () => void) => {
    gsap.to(el, {
        duration: NORMAL_DURATION,
        opacity: 0,
        ease: 'power1.in',
        onComplete: done,
    });
}