// IMPORTANT NOTE: will be used and changed when implemented in the cauldron interaction pages 

import moment from "moment";

export const getLockedUntil = async (sspell, user) => {
  try {
    const infoResp = await sspell.users(user);
    const lockTimestamp = infoResp.lockedUntil.toString();
    const currentTimestamp = moment().unix().toString();

    if (lockTimestamp && +lockTimestamp > +currentTimestamp)
      return lockTimestamp;

    return false;
  } catch (error) {
    console.log("getLockedUntil error:", error);
  }
};
