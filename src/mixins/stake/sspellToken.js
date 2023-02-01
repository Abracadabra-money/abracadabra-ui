import tokensAbi from "@/utils/abi/tokensAbi/index";
import { mapMutations } from "vuex";
import moment from "moment";

import { getTokenPriceByAddress } from "@/helpers/priceHelper";

import {
  getSpellStakingApr,
  getTokensRate,
} from "@/helpers/spellStake/spellStakingApr";

export default {
  data() {
    return {
      spellPrice: null,
      stakeInfo: {
        mainToken: {
          name: "sSPELL",
          address: "0x26FA3fFFB6EfE8c1E69103aCb4044C26B9A106a9",
          decimals: 18,
          abi: tokensAbi.sSPELL,
          icon: require("@/assets/images/sspell-icon.svg"),
        },
        stakeToken: {
          name: "SPELL",
          address: "0x090185f2135308BaD17527004364eBcC2D37e5F6",
          decimals: 18,
          abi: tokensAbi.SPELL,
          icon: require("@/assets/images/spell-icon.svg"),
        },
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
    ...mapMutations({ setLoadingSSpellStake: "setLoadingSSpellStake" }),
    async createStakePool() {
      if (this.chainId !== 1) {
        this.setLoadingSSpellStake(false);
        return false;
      }

      const { mainToken, stakeToken } = this.stakeInfo;

      const mainTokenInstance = new this.$ethers.Contract(
        mainToken.address,
        JSON.stringify(mainToken.abi),
        this.signer
      );

      const stakeTokenInstance = new this.$ethers.Contract(
        stakeToken.address,
        JSON.stringify(stakeToken.abi),
        this.signer
      );

      const tokensRate = await getTokensRate();

      const stakeTokenPrice = this.spellPrice
        ? this.spellPrice
        : await getTokenPriceByAddress(1, stakeToken.address); // SPELL token price

      const mainTokenPrice = +stakeTokenPrice * +tokensRate;

      const { sSpellApr } = await getSpellStakingApr();

      // is user connected block (UPDATE IN FUTURE)
      let lockedUntil = false;
      let mainTokenBalance = 0;
      let stakeTokenBalance = 0;
      let isTokenApprowed = false;

      if (this.account) {
        isTokenApprowed = await this.isTokenApprowed(
          stakeTokenInstance,
          this.account,
          mainToken.address
        );

        lockedUntil = await this.getUserLocked(mainTokenInstance);

        mainTokenBalance = await mainTokenInstance.balanceOf(this.account);

        mainTokenBalance = this.$ethers.utils.formatEther(
          mainTokenBalance.toString()
        );

        stakeTokenBalance = await stakeTokenInstance.balanceOf(this.account);

        stakeTokenBalance = this.$ethers.utils.formatEther(
          stakeTokenBalance.toString()
        );
      }

      const stakeObject = {
        tokensRate,
        apr: sSpellApr,
        lockedUntil,
        mainToken: {
          ...mainToken,
          contractInstance: mainTokenInstance,
          balance: mainTokenBalance,
          price: mainTokenPrice,
        },
        stakeToken: {
          ...stakeToken,
          contractInstance: stakeTokenInstance,
          balance: stakeTokenBalance,
          isTokenApprowed,
          price: stakeTokenPrice,
        },
      };

      this.$store.commit("setSSpellObject", stakeObject);
      this.setLoadingSSpellStake(false);
    },
    async getUserLocked(contractInstance) {
      try {
        const infoResp = await contractInstance.users(this.account);

        const lockTimestamp = infoResp.lockedUntil.toString();
        const currentTimestamp = moment().unix().toString();

        if (+lockTimestamp > 0 && lockTimestamp > currentTimestamp)
          return lockTimestamp;
        return false;
      } catch (e) {
        console.log("isApprowed err:", e);
        return false;
      }
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
