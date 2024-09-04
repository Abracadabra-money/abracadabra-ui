import gsap from "gsap";

export const notificationSlideIn = (notification: gsap.TweenTarget) => {
    gsap.fromTo(
        notification,
        { y: "100%" },
        { duration: 0.3, y: "0%", ease: "power2.out" }
    );
}

export const notificationFadeOutSlideOut = (notification: gsap.TweenTarget) => {
    gsap.to(notification, {
        duration: 0.3,
        y: "-100%",
        opacity: 0,
        ease: "power2.in",
    });
}