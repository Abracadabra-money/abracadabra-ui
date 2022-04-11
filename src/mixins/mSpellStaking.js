import mimTokenAbi from "@/utils/abi/tokensAbi/MIM";
import spellTokenAbi from "@/utils/abi/tokensAbi/SPELL";
import mSpellStakingAbi from "@/utils/abi/mSpellStakingAbi";
import moment from "moment";

import { getSpellStakingApr } from "@/helpers/spellStakingApr";

export default {
  data() {
    return {
      stakingContracts: {
        "1": "0xbD2fBaf2dc95bD78Cf1cD3c5235B33D1165E6797",
        "0xfa": "0xa668762fb20bcd7148Db1bdb402ec06Eb6DAD569",
        "0xa86a": "0xBd84472B31d947314fDFa2ea42460A2727F955Af",
        "0xa4b1": "0x1DF188958A8674B5177f77667b8D173c3CdD9e51",
      },
    };
  },
  computed: {
    chainId() {
      return this.$store.getters.getChainId;
    },
    signer() {
      return this.$store.getters.getSigner;
    },
    account() {
      return this.$store.getters.getAccount;
    },
  },
  methods: {
    async createMSpellStaking() {
      console.log("createMSpellStaking",Number(this.chainId).toString(16))
      if (!this.account) {
        this.$store.commit("setLoadingMSpellStake", false);
        return false;
      }

      const mSpellStakingAddr = this.stakingContracts[this.chainId];
      console.log(mSpellStakingAddr)
      if (!mSpellStakingAddr) {
        this.$store.commit("setLoadingMSpellStake", false);
        return false;
      }

      const mSpellStakingContract = new this.$ethers.Contract(
        mSpellStakingAddr,
        JSON.stringify(mSpellStakingAbi),
        this.signer
      );

      console.log("mSpellStakingContract", mSpellStakingContract);

      const spellAddr = await mSpellStakingContract.spell();
      const mimAddr = await mSpellStakingContract.mim();

      console.log(spellAddr, mimAddr);

      const spellTokenContract = new this.$ethers.Contract(
        spellAddr,
        JSON.stringify(spellTokenAbi),
        this.signer
      );

      const mimTokenContract = new this.$ethers.Contract(
        mimAddr,
        JSON.stringify(mimTokenAbi),
        this.signer
      );

      console.log("mSpellStakingAddr", mSpellStakingAddr);

      let spellTokenBalance = await spellTokenContract.balanceOf(this.account);

      spellTokenBalance = this.$ethers.utils.formatEther(
        spellTokenBalance.toString()
      );

      const isTokenApprowed = await this.isTokenApprowed(
        spellTokenContract,
        this.account,
        mSpellStakingContract.address
      );

      const userInfo = await mSpellStakingContract.userInfo(this.account);

      const depositAmount = this.$ethers.utils.formatEther(
        userInfo.amount.toString()
      );

      let claimableAmount = await mSpellStakingContract.pendingReward(
        this.account
      );

      claimableAmount = this.$ethers.utils.formatEther(
        claimableAmount.toString()
      );

      const spellPrice = await this.getTokenPrice("Spell"); // sspellToken.js mixin

      const lockTimestamp = moment
        .unix(userInfo.lastAdded.toString())
        .add(1, "d");
      const currentTimestamp = moment();

      let lockedUntil = false;

      if (+userInfo.lastAdded > 0 && lockTimestamp.isAfter(currentTimestamp)) {
        lockedUntil = lockTimestamp.unix().toString();
      }

      const { mSpellApr } = await getSpellStakingApr();

      const mSpellStakingObj = {
        mSpellStakingContract,
        spellTokenContract,
        mimTokenContract,
        spellTokenBalance,
        isTokenApprowed,
        userInfo,
        depositAmount,
        claimableAmount,
        lockedUntil,
        apr: mSpellApr,
        stakeToken: {
          name: "SPELL",
          balance: spellTokenBalance,
          decimals: 18,
          isTokenApprowed,
          price: spellPrice,
        },
        mainToken: {
          name: "mSPELL",
          balance: depositAmount,
          decimals: 18,
          price: spellPrice,
        },
      };

      console.log("mSpellStakingObj", mSpellStakingObj);

      this.$store.commit("setMSpellStakingObj", mSpellStakingObj);
      this.$store.commit("setLoadingMSpellStake", false);

      // await getSpellStakingRate();
      // await getSpellApr();
    },
    async isTokenApprowed(tokenContract, userAddr, approveAddr) {
      try {
        const addressApprowed = await tokenContract.allowance(
          userAddr,
          approveAddr,
          {
            gasLimit: 1000000,
          }
        );

        return parseFloat(addressApprowed.toString()) > 0;
      } catch (e) {
        console.log("SPELL isApprowed err:", e);
        return false;
      }
    },
  },
};
