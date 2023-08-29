import tokensAbi from "@/utils/abi/tokensAbi/index";
import magicLVLJuniorAbi from "@/utils/abi/oracle/magicLVLJunior";
import magicLVLMezzanineAbi from "@/utils/abi/oracle/magicLVLMezzanine";
import magicLVLSeniorAbi from "@/utils/abi/oracle/magicLVLSenior";
import lvlIcon from "@/assets/images/tokens/LVL.png";
import mLvlSeniorIcon from "@/assets/images/tokens/mLvlSenior.png";
import mLvlMezzanineIcon from "@/assets/images/tokens/mLvlMezzanine.png";
import mLvlJuniorIcon from "@/assets/images/tokens/mLvlJunior.png";
import levelMasterV2Abi from "@/utils/abi/levelMasterV2";
import harvestorAbi from "@/utils/abi/lvl/harvestor";
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

export const magicLvlConfig = {
  56: {
    master: {
      address: MASTER_ADDRESS,
      abi: levelMasterV2Abi,
    },
    harvestor: {
      address: HARVESTOR_ADDRESS,
      abi: harvestorAbi,
    },
    senior: {
      name: "senior",
      mainToken: {
        name: "mLVS",
        address: SENIOR_ADDRESS,
        decimals: 18,
        abi: tokensAbi.mLvlSenior,
        icon: mLvlSeniorIcon,
      },
      stakeToken: {
        name: "snrLLP",
        address: SENIOR_LLP_ADDRESS,
        decimals: 18,
        abi: tokensAbi.lvlSenior,
        icon: lvlIcon,
      },
      oracle: {
        address: SENIOR_ORACLE_ADDRESS,
        abi: magicLVLSeniorAbi,
      },
      pid: 0,
    },
    mezzanine: {
      name: "mezzanine",
      mainToken: {
        name: "mLVM",
        address: MEZZANINE_ADDRESS,
        decimals: 18,
        abi: tokensAbi.mLvlMezzanine,
        icon: mLvlMezzanineIcon,
      },
      stakeToken: {
        name: "mzeLLP",
        address: MEZZANINE_LLP_ADDRESS,
        decimals: 18,
        abi: tokensAbi.lvlMezzanine,
        icon: lvlIcon,
      },
      oracle: {
        address: MEZZANINE_ORACLE_ADDRESS,
        abi: magicLVLMezzanineAbi,
      },
      pid: 1,
    },
    junior: {
      name: "junior",
      mainToken: {
        name: "mLVJ",
        address: JUNIOR_ADDRESS,
        decimals: 18,
        abi: tokensAbi.mLvlJunior,
        icon: mLvlJuniorIcon,
      },
      stakeToken: {
        name: "jnrLLP",
        address: JUNIOR_LLP_ADDRESS,
        decimals: 18,
        abi: tokensAbi.lvlJunior,
        icon: lvlIcon,
      },
      oracle: {
        address: JUNIOR_ORACLE_ADDRESS,
        abi: magicLVLJuniorAbi,
      },
      pid: 2,
    },
  },
};
