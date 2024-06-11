export const getLensAddress = (chainId: Number): string => {
  // check type
  switch (Number(chainId)) {
    case 80084:
      return "0x1E217d3cA2a19f2cB0F9f12a65b40f335286758E";
    default:
      return "0x1d17009Dde57CAea3dC614962a6c01420776523f";
  }
};
