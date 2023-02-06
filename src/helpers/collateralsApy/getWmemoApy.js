import { ethers } from "ethers";
import timeStakingAbi from "@/utils/abi/timeStaking";
import memoTokenAbi from "@/utils/abi/tokensAbi/MEMO";

export const getWmemoApy = async (provider) => {
  try {
    const STAKING_ADDRESS = "0x4456B87Af11e87E329AB7d7C7A246ed1aC2168B9";
    const MEMO_ADDRESS = "0x136Acd46C134E8269052c62A67042D6bDeDde3C9";

    const stakingContract = new ethers.Contract(
      STAKING_ADDRESS,
      JSON.stringify(timeStakingAbi),
      provider
    );
    const memoContract = new ethers.Contract(
      MEMO_ADDRESS,
      JSON.stringify(memoTokenAbi),
      provider
    );

    const epoch = await stakingContract.epoch();
    const stakingReward = epoch.distribute;
    const circ = await memoContract.circulatingSupply();
    const stakingRebase = stakingReward / circ;
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

    const result = stakingAPY * 100;

    return result;
  } catch (e) {
    console.log("getMEMOApy ERROR", e);
  }
};