export const getLensAddress = (chainId: Number): string => {
  switch (chainId) {
    case 80085:
      return "0xaE031bDe8582BE194AEeBc097710c97a538BBE90";
    default:
      return "0x1d17009Dde57CAea3dC614962a6c01420776523f";
  }
};
