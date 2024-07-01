const checkWhitelistLogic = (cauldronObject) => {
  if (!cauldronObject.config.cauldronSettings.hasWhitelistLogic) return false;

  const { whitelistedInfo } = cauldronObject.additionalInfo;
  if (+whitelistedInfo?.amountAllowedParsed < +whitelistedInfo?.userBorrowPart)
    return true;

  return false;
};

export default checkWhitelistLogic;
