import {
  SENIOR_ADDRESS,
  SENIOR_LLP_ADDRESS,
  SENIOR_ORACLE_ADDRESS,
  MEZZANINE_ADDRESS,
  MEZZANINE_LLP_ADDRESS,
  MEZZANINE_ORACLE_ADDRESS,
  JUNIOR_ADDRESS,
  JUNIOR_LLP_ADDRESS,
  JUNIOR_ORACLE_ADDRESS,
  MASTER_ADDRESS,
  HARVESTOR_ADDRESS,
} from "@/constants/lvlFinance";
import tokensAbi from "@/abis/tokensAbi/index";
import lvlIcon from "@/assets/images/tokens/LVL.png";
import harvestorAbi from "@/abis/lvl/harvestor";
import levelMasterV2Abi from "@/abis/levelMasterV2";
import magicLVLSeniorAbi from "@/abis/oracle/magicLVLSenior";
import magicLVLJuniorAbi from "@/abis/oracle/magicLVLJunior";
import type { MagicLvlConfig } from "@/types/magicLvl/configsInfo";
import mLvlJuniorIcon from "@/assets/images/tokens/mLvlJunior.png";
import mLvlSeniorIcon from "@/assets/images/tokens/mLvlSenior.png";
import magicLVLMezzanineAbi from "@/abis/oracle/magicLVLMezzanine";
import mLvlMezzanineIcon from "@/assets/images/tokens/mLvlMezzanine.png";

export const magicLvlConfig: MagicLvlConfig = {
  56: {
    master: {
      address: MASTER_ADDRESS,
      abi: levelMasterV2Abi,
    },
    harvestor: {
      address: HARVESTOR_ADDRESS,
      abi: harvestorAbi,
    },
    tokensConfig: [
      {
        name: "senior",
        mainToken: {
          name: "mLVS",
          decimals: 18,
          icon: mLvlSeniorIcon,
          contract: {
            address: SENIOR_ADDRESS,
            abi: tokensAbi.mLvlSenior,
          },
        },
        stakeToken: {
          name: "snrLLP",
          decimals: 18,
          icon: lvlIcon,
          contract: {
            address: SENIOR_LLP_ADDRESS,
            abi: tokensAbi.lvlSenior,
          },
        },
        oracle: {
          address: SENIOR_ORACLE_ADDRESS,
          abi: magicLVLSeniorAbi,
        },
        pid: 0,
      },
      {
        name: "mezzanine",
        mainToken: {
          name: "mLVM",
          decimals: 18,
          icon: mLvlMezzanineIcon,
          contract: {
            address: MEZZANINE_ADDRESS,
            abi: tokensAbi.mLvlMezzanine,
          },
        },
        stakeToken: {
          name: "mzeLLP",
          decimals: 18,
          icon: lvlIcon,
          contract: {
            address: MEZZANINE_LLP_ADDRESS,
            abi: tokensAbi.lvlMezzanine,
          },
        },
        oracle: {
          address: MEZZANINE_ORACLE_ADDRESS,
          abi: magicLVLMezzanineAbi,
        },
        pid: 1,
      },
      {
        name: "junior",
        mainToken: {
          name: "mLVJ",
          decimals: 18,
          icon: mLvlJuniorIcon,
          contract: {
            address: JUNIOR_ADDRESS,
            abi: tokensAbi.mLvlJunior,
          },
        },
        stakeToken: {
          name: "jnrLLP",
          decimals: 18,
          icon: lvlIcon,
          contract: {
            address: JUNIOR_LLP_ADDRESS,
            abi: tokensAbi.lvlJunior,
          },
        },
        oracle: {
          address: JUNIOR_ORACLE_ADDRESS,
          abi: magicLVLJuniorAbi,
        },
        pid: 2,
      },
    ],
  },
};
