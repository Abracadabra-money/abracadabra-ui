import { getLpInfo, getUserLpInfo, querySellBase } from "./magicLp";

const SwapRouter = "0x15f57fbCB7A443aC6022e051a46cAE19491bC298";
const MimWethLp = "0x06894D4b33565dF998E80dE5D1718Ac5425DA216";
const account = "0x8764F421AB0C682b4Ba1d7e269C09187c1EfbFAF"; // Calibur's test
const chainId = 168587773; // Blast Sepolia testnet

export const blastTestingHelpers = async () => {
  try {
    // used to obtain information about the LP
    const getLpInfoResult = await getLpInfo(MimWethLp, chainId);
    console.log("getLpInfoResult", getLpInfoResult);
    // -- //

    // used to obtain user information about lp
    const getUserLpInfoResult = await getUserLpInfo(
      MimWethLp,
      SwapRouter,
      account,
      chainId
    );
    console.log("getUserLpInfoResult", getUserLpInfoResult);
    // -- //

    // base token sale
    // const querySellBaseResult = querySellBase(
    //   10000000n,
    //   getLpInfoResult,
    //   getUserLpInfoResult
    // );
    // console.log("querySellBaseResult", querySellBaseResult);
    // -- //
  } catch (error) {
    console.log("testingError:", error);
  }
};
