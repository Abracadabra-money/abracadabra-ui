import gsap from "gsap";

export const dropdownRollDown = (dropdown: gsap.TweenTarget) => {
    gsap.fromTo(
        dropdown,
        { y: -20, height: 0 },
        { duration: 0.3, y: 0, height: "auto", ease: "power2.out" }
    );
}

export const dropdownRollUp = (dropdown: gsap.TweenTarget) => {
    gsap.to(dropdown, {
        duration: 0.3,
        y: -20,
        height: 0,
        ease: "power2.in",
    });
}