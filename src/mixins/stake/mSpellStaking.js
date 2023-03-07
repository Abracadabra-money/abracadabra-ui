import spellTokenAbi from "@/utils/abi/tokensAbi/SPELL";
import mSpellStakingAbi from "@/utils/abi/mSpellStakingAbi";
import moment from "moment";

import { getTokenPriceByAddress } from "@/helpers/priceHelper";
import { getSpellStakingApr } from "@/helpers/spellStake/spellStakingApr";

export default {
  data() {
    return {
      spellPrice: null,
      stakingContracts: {
        1: "0xbD2fBaf2dc95bD78Cf1cD3c5235B33D1165E6797",
        250: "0xa668762fb20bcd7148Db1bdb402ec06Eb6DAD569",
        43114: "0xBd84472B31d947314fDFa2ea42460A2727F955Af",
        42161: "0x1DF188958A8674B5177f77667b8D173c3CdD9e51",
      },
    };
  },
  computed: {
    chainId() {
      return this.$store.getters.getChainId;
    },
    defaultProvider() {
      return this.$store.getters.getProvider;
    },
    signer() {
      return this.$store.getters.getSigner || this.defaultProvider;
    },
    account() {
      return this.$store.getters.getAccount;
    },
  },
  methods: {
    async createMSpellStaking() {
      const mSpellStakingAddr = this.stakingContracts[this.chainId];

      if (!mSpellStakingAddr) {
        this.$store.commit("setLoadingMSpellStake", false);
        return false;
      }

      const mSpellStakingContract = new this.$ethers.Contract(
        mSpellStakingAddr,
        JSON.stringify(mSpellStakingAbi),
        this.signer
      );

      const spellAddr = await mSpellStakingContract.spell();

      const spellTokenContract = new this.$ethers.Contract(
        spellAddr,
        JSON.stringify(spellTokenAbi),
        this.signer
      );

      const spellPrice = this.spellPrice
        ? this.spellPrice
        : await getTokenPriceByAddress(
            1,
            "0x090185f2135308BaD17527004364eBcC2D37e5F6"
          ); // SPELL token price

      const { mSpellApr } = await getSpellStakingApr();

      // is user connected block (UPDATE IN FUTURE)
      let lockedUntil = false;
      let spellTokenBalance = 0;
      let isTokenApprowed = false;
      let depositAmount = 0;
      let claimableAmount = 0;

      if (this.account) {
        spellTokenBalance = await spellTokenContract.balanceOf(this.account);

        spellTokenBalance = this.$ethers.utils.formatEther(
          spellTokenBalance.toString()
        );

        isTokenApprowed = await this.isTokenApprowed(
          spellTokenContract,
          this.account,
          mSpellStakingContract.address
        );

        const userInfo = await mSpellStakingContract.userInfo(this.account);

        depositAmount = this.$ethers.utils.formatEther(
          userInfo.amount.toString()
        );

        claimableAmount = await mSpellStakingContract.pendingReward(
          this.account
        );

        claimableAmount = this.$ethers.utils.formatEther(
          claimableAmount.toString()
        );

        const lockTimestamp = moment
          .unix(userInfo.lastAdded.toString())
          .add(1, "d");
        const currentTimestamp = moment();

        if (
          +userInfo.lastAdded > 0 &&
          lockTimestamp.isAfter(currentTimestamp)
        ) {
          lockedUntil = lockTimestamp.unix().toString();
        }
      }

      const mSpellStakingObj = {
        tokensRate: 1,
        mSpellStakingContract,
        claimableAmount,
        lockedUntil,
        apr: mSpellApr,
        stakeToken: {
          name: "SPELL",
          contractInstance: spellTokenContract,
          balance: spellTokenBalance,
          decimals: 18,
          isTokenApprowed,
          price: spellPrice,
          icon: require("@/assets/images/spell-icon.svg"),
        },
        mainToken: {
          name: "mSPELL",
          contractInstance: mSpellStakingContract,
          balance: depositAmount,
          decimals: 18,
          price: spellPrice,
          icon: require("@/assets/images/mspell-icon.svg"),
        },
      };

      this.$store.commit("setMSpellStakingObj", mSpellStakingObj);
      this.$store.commit("setLoadingMSpellStake", false);
    },
    async isTokenApprowed(tokenContract, userAddr, approveAddr) {
      try {
        const addressApprowed = await tokenContract.allowance(
          userAddr,
          approveAddr
        );

        return parseFloat(addressApprowed.toString()) > 0;
      } catch (e) {
        console.log("SPELL isApprowed err:", e);
        return false;
      }
    },
  },
};
