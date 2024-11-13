import { animations } from "@/helpers/useAnimation/animations/";
import { DEFAULT_ANIMATION } from "@/helpers/useAnimation/constants";

export const useAnimation = (animationType = DEFAULT_ANIMATION) => {
  const animation = animations[animationType as keyof typeof animations];

  if (!animation) {
    throw new Error(`Animation "${animationType}" not found`);
  }

  const beforeEnter = (element: HTMLElement) => {
    if ("beforeEnter" in animation) animation.beforeEnter(element);
  };

  const enter = (element: HTMLElement, done: () => void) => {
    animation.enter(element, done);
  };

  const leave = (element: HTMLElement, done: () => void) => {
    animation.leave(element, done);
  };

  return { beforeEnter, enter, leave };
};
