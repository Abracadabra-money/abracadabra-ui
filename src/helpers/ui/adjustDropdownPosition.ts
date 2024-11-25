export const adjustDropdownPosition = (dropdown: HTMLElement | null) => {
  if (!dropdown) return;

  const prevDisplay = dropdown.style.display;
  dropdown.style.display = "block";
  const rect = dropdown.getBoundingClientRect();
  dropdown.style.display = prevDisplay;

  const offset = 10;

  if (rect.right > window.innerWidth) {
    dropdown.style.right = `${offset}px`;
  } else if (rect.left < 0) {
    dropdown.style.left = `${offset}px`;
    dropdown.style.right = "auto";
  } else {
    dropdown.style.left = `auto`;
    dropdown.style.right = `0`;
  }
};
