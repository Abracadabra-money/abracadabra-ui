import { Contract } from "ethers";
import { MulticallWrapper } from "ethers-multicall-provider";
import abiERC20 from "@/utils/zeroXSwap/abi/abiERC20";

const accountsList = {
  "0xb7638f0040f116668201fb822446c1857035a9a2": [
    {
      token: "0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9",
      spender: "0x6cbAFEE1FaB76cA5B5e144c43B3B50d42b7C8c8f",
    },
    {
      token: "0xa9fE4601811213c340e850ea305481afF02f5b28",
      spender: "0x6Ff9061bB8f97d948942cEF376d98b51fA38B91f",
    },
  ],
  "0x3c1cb7d4c0ce0dc72edc7ea06acc866e62a8f1d8": [
    {
      token: "0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9",
      spender: "0x6cbAFEE1FaB76cA5B5e144c43B3B50d42b7C8c8f",
    },
    {
      token: "0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3",
      spender: "0xbb02A884621FB8F5BFd263A67F58B65df5b090f3",
    },
  ],
  "0xc77fa6c05b4e472feee7c0f9b20e70c5bf33a99b": [
    {
      token: "0x7Da96a3891Add058AdA2E826306D812C638D87a7",
      spender: "0x551a7CfF4de931F32893c928bBc3D25bF1Fc5147",
    },
  ],
  "0x4b5e43712790de7c8eb1565af482eb848195193b": [
    {
      token: "0x7Da96a3891Add058AdA2E826306D812C638D87a7",
      spender: "0x551a7CfF4de931F32893c928bBc3D25bF1Fc5147",
    },
  ],
  "0x5815d8951967e202d9b5380fed6c9f0a7fc71c5c": [
    {
      token: "0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3",
      spender: "0xEBfDe87310dc22404d918058FAa4D56DC4E93f0A",
    },
    {
      token: "0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3",
      spender: "0x003d5A75d284824Af736df51933be522DE9Eed0f",
    },
  ],
  "0x9f1a540a4b3c0a1567016171580c119347e55ccb": [
    {
      token: "0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3",
      spender: "0x390Db10e65b5ab920C19149C919D970ad9d18A41",
    },
  ],
  "0x8a30d3bb32291dbbb5f88f905433e499638387b7": [
    {
      token: "0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3",
      spender: "0x003d5A75d284824Af736df51933be522DE9Eed0f",
    },
  ],
  "0xf23881837650a421316b78ae9ce04b67f45bbaec": [
    {
      token: "0xa47c8bf37f92aBed4A126BDA807A7b7498661acD",
      spender: "0x59E9082E068Ddb27FC5eF1690F9a9f22B32e573f",
    },
  ],
  "0x003795bc6bf15c8491325cbe77a259c21f45fe72": [
    {
      token: "0xdf0770dF86a8034b3EFEf0A1Bb3c889B8332FF56",
      spender: "0xd31E19A0574dBF09310c3B06f3416661B4Dc7324",
    },
  ],
};

const getAllowanceDatas = async (account, provider) => {
  const isUserInList = !!accountsList[account.toLowerCase()];
  if (!isUserInList) return false;

  const userInfo = accountsList[account.toLowerCase()];
  const multicallProvider = MulticallWrapper.wrap(provider);

  const allowanceArrResp = await Promise.all(
    userInfo.map(({ token, spender }) => {
      const tokenContract = new Contract(token, abiERC20, multicallProvider);
      return tokenContract.allowance(account, spender);
    })
  );

  return userInfo.map((info, idx) => {
    return {
      ...info,
      isStillApproved: allowanceArrResp[idx].gt(0),
    };
  });
};

export { getAllowanceDatas };
