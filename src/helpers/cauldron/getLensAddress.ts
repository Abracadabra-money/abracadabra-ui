export const getLensAddress = (chainId: Number): string => {
  switch (chainId) {
    case 1:
      return "0x26ecfcd82bf36427006794d41927da334f762230";
    case 2222:
      return "0x2d50927A6E87E517946591A137b765fAba018E70";
    default:
      return "0x73f52bd9e59edbdf5cf0dd59126cef00ecc31528";
  }
};
