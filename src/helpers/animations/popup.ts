import gsap from "gsap";

export const popupFadeIn = (popup: gsap.TweenTarget) => {
    gsap.fromTo(
        popup,
        { scale: 0, opacity: 0 },
        { duration: 0.15, scale: 1, opacity: 1, ease: "power2.out" }
    );
}

export const popupFadeOut = (popup: gsap.TweenTarget) => {
    gsap.to(popup, {
        duration: 0.15,
        scale: 0,
        opacity: 0,
        ease: "power2.in",
    });
}

export const popupFadeInSlideUp = (popup: gsap.TweenTarget) => {
    gsap.fromTo(
        popup,
        { y: 100 },
        { duration: 0.15, y: 0, ease: "power2.out" }
    );
}

export const popupFadeOutSlideDown = (popup: gsap.TweenTarget) => {
    gsap.to(popup, {
        duration: 0.15,
        y: 100,
        ease: "power2.in",
    });
}

export const backdropFadeIn = (backdrop: gsap.TweenTarget) => {
    gsap.fromTo(
        backdrop,
        { autoAlpha: 0 },
        { duration: 0.15, autoAlpha: 1 }
    );
}

export const backdropFadeOut = (backdrop: gsap.TweenTarget) => {
    gsap.to(backdrop, { duration: 0.15, autoAlpha: 0 });
}

export const localPopupWrapFadeIn = (backdrop: gsap.TweenTarget) => {
    gsap.fromTo(
        backdrop,
        { autoAlpha: 0 },
        { duration: 0.15, autoAlpha: 1, display: "grid" }
    );
}