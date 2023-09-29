export const getLensAddress = (chainId: Number): string => {
  switch (chainId) {
    case 1:
      return "0x26ecfcd82bf36427006794d41927da334f762230";
    default:
      return "0x73f52bd9e59edbdf5cf0dd59126cef00ecc31528";
  }
};
