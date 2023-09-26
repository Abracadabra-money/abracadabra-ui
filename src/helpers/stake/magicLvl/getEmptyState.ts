import type {
  MagicLvlStakeInfo,
  MagicLvlTranchesInfo,
} from "@/types/magicLvl/stakeInfo";
import { MASTER_ADDRESS } from "@/constants/lvlFinance";
import { magicLvlConfig } from "@/utils/stake/magicLvlConfig";
import { getAdditionalInfo } from "@/helpers/stake/magicLvl/getAdditionalInfo";

const {
  mainToken: seniorMainToken,
  stakeToken: seniorStakeToken,
  pid: jseniorPid,
}: any = magicLvlConfig[56].tokensConfig[0];
const {
  mainToken: mezzanineMainToken,
  stakeToken: mezzanineStakeToken,
  pid: mezzaninePid,
}: any = magicLvlConfig[56].tokensConfig[1];
const {
  mainToken: juniorMainToken,
  stakeToken: juniorStakeToken,
  pid: juniorPid,
}: any = magicLvlConfig[56].tokensConfig[2];

const config: MagicLvlTranchesInfo = {
  junior: {
    name: "Junior",
    tokensRate: 100000000000000000n,
    feePercent: 0.1,
    levelMasterContract: {
      address: MASTER_ADDRESS,
      abi: "",
    },
    mainToken: {
      name: juniorMainToken.name,
      icon: juniorMainToken.icon,
      decimals: juniorMainToken.decimals,
      contract: juniorMainToken.contract,
      balance: 0n,
      totalSupplyUsd: 10000000000000000n,
      approvedAmount: 0n,
    },
    stakeToken: {
      name: juniorStakeToken.name,
      icon: juniorStakeToken.icon,
      decimals: juniorStakeToken.decimals,
      contract: juniorStakeToken.contract,
      walletBalance: 0n,
      balance: 0n,
      pid: juniorPid,
    },
  },
  mezzanine: {
    name: "Mezzanine",
    tokensRate: 10000000000000000n,
    feePercent: 0.1,
    levelMasterContract: {
      address: MASTER_ADDRESS,
      abi: "",
    },
    mainToken: {
      name: mezzanineMainToken.name,
      icon: mezzanineMainToken.icon,
      decimals: mezzanineMainToken.decimals,
      contract: mezzanineMainToken.contract,
      balance: 0n,
      totalSupplyUsd: 10000000000000000n,
      approvedAmount: 0n,
    },
    stakeToken: {
      name: mezzanineStakeToken.name,
      icon: mezzanineStakeToken.icon,
      decimals: mezzanineStakeToken.decimals,
      contract: mezzanineStakeToken.contract,
      walletBalance: 0n,
      balance: 0n,
      pid: mezzaninePid,
    },
  },
  senior: {
    name: "Senior",
    tokensRate: 10000000000000000n,
    feePercent: 0.01,
    levelMasterContract: {
      address: MASTER_ADDRESS,
      abi: "",
    },
    mainToken: {
      name: seniorMainToken.name,
      icon: seniorMainToken.icon,
      decimals: seniorMainToken.decimals,
      contract: seniorMainToken.contract,
      balance: 0n,
      totalSupplyUsd: 10000000000000000n,
      approvedAmount: 0n,
    },
    stakeToken: {
      name: seniorStakeToken.name,
      icon: seniorStakeToken.icon,
      decimals: seniorStakeToken.decimals,
      contract: seniorStakeToken.contract,
      walletBalance: 0n,
      balance: 0n,
      pid: jseniorPid,
    },
  },
};

export const getEmptyState = async (): Promise<MagicLvlStakeInfo> => {
  const additionalInfo = await getAdditionalInfo(config);

  return { ...config, ...additionalInfo };
};
