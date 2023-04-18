const useImage = (url) => {
  return new URL(`/src/${url}`, import.meta.url).href;
};

export { useImage };
