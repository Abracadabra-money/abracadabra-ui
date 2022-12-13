const { providers, Contract } = require("ethers");
const { rpc } = require("./constants");

const provider = new providers.JsonRpcProvider(rpc);

const MimCauldronDistributorLensAddress =
  "0x9b0b1c5df1bfE11dbC189c00de58d36C6cA3F583";
import MimCauldronDistributorLensAbi from "./abis/MimCauldronDistributorLens";

const getCaulronTargetApy = async () => {
  const mimCauldronDistributorLensContract = new Contract(
    MimCauldronDistributorLensAddress,
    MimCauldronDistributorLensAbi,
    provider
  );
  const caulronTargetApy =
    await mimCauldronDistributorLensContract.getCaulronTargetApy(
      "0x5698135CA439f21a57bDdbe8b582C62f090406D5"
    );
  return caulronTargetApy;
};


export { getCaulronTargetApy }