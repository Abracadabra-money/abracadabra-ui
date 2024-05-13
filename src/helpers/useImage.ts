export const useImage = (url: string) => {
  return new URL(`/src/${url}`, import.meta.url).href;
};
