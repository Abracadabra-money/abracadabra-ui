// import moment from "moment";
import oracleAbi from "@/utils/abi/oracle";
import { mapGetters, mapMutations } from "vuex";
import tokensAbi from "@/utils/abi/tokensAbi/index";
import degenBoxERC4626WrapperAbi from "@/utils/abi/DegenBoxERC4626Wrapper";

export default {
  data() {
    return {
      glpPrice: null,
      stakeInfo: {
        mainToken: {
          name: "mGLP",
          address: "0x85667409a723684Fe1e57Dd1ABDe8D88C2f54214",
          decimals: 18,
          abi: tokensAbi.magicGLP,
          icon: require("@/assets/images/tokens/mGLP.png"),
          wrapperAddress: "0x3c34bC7c7461fc9AF1E5511C0636c07F129B4187",
        },
        stakeToken: {
          name: "sGLP",
          address: "0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf",
          decimals: 18,
          abi: tokensAbi.sGLP,
          icon: require(`@/assets/images/tokens/GLP.png`),
        },
        oracle: {
          address: "0x4ED0935ecC03D7FcEfb059e279BCD910a02F284C",
          abi: oracleAbi,
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      chainId: "getChainId",
      provider: "getProvider",
      account: "getAccount",
    }),

    signer() {
      return this.$store.getters.getSigner || this.provider;
    },
  },
  methods: {
    ...mapMutations(["setLoadingMGlpStake", "setMGlpStakingObj"]),

    async createStakePool() {
      if (this.chainId !== 42161) return !!this.setLoadingMGlpStake(false);

      const { mainToken, stakeToken, oracle } = this.stakeInfo;

      const mainTokenInstance = await new this.$ethers.Contract(
        mainToken.address,
        JSON.stringify(mainToken.abi),
        this.signer
      );

      const stakeTokenInstance = await new this.$ethers.Contract(
        stakeToken.address,
        JSON.stringify(stakeToken.abi),
        this.signer
      );

      const oracleContract = await new this.$ethers.Contract(
        oracle.address,
        JSON.stringify(oracle.abi),
        this.signer
      );

      const wrapperContract = await new this.$ethers.Contract(
        mainToken.wrapperAddress,
        JSON.stringify(degenBoxERC4626WrapperAbi),
        this.signer
      );

      if (!this.glpPrice) {
        const rate = await oracleContract.peekSpot("0x");
        this.glpPrice = this.$ethers.utils.formatUnits(rate, 18);
      }

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

        // todo
        //   lockedUntil = await this.getUserLocked(mainTokenInstance);

        mainTokenBalance = await mainTokenInstance.balanceOf(this.account);
        mainTokenBalance = this.$ethers.utils.formatEther(
          mainTokenBalance.toString()
        );

        stakeTokenBalance = await stakeTokenInstance.balanceOf(this.account);
        stakeTokenBalance = this.$ethers.utils.formatEther(
          stakeTokenBalance.toString()
        );
      }

      const mainTokenBalanceUsd = mainTokenBalance * this.glpPrice;
      const stakeTokenBalanceUsd = stakeTokenBalance * this.glpPrice;

      let totalSupply = await mainTokenInstance.totalSupply();
      totalSupply = this.$ethers.utils.formatUnits(totalSupply, 18);
      const totalSupplyUsd = totalSupply * this.glpPrice;

      const stakeObject = {
        apr: 10,
        lockedUntil,

        mainToken: {
          ...mainToken,
          contractInstance: mainTokenInstance,
          balance: mainTokenBalance,
          price: this.glpPrice,
          balanceUsd: mainTokenBalanceUsd,
          totalSupply,
          totalSupplyUsd,
        },
        stakeToken: {
          ...stakeToken,
          contractInstance: stakeTokenInstance,
          balance: stakeTokenBalance,
          isTokenApprowed,
          price: this.glpPrice,
          balanceUsd: stakeTokenBalanceUsd,
        },
        wrapperContract,
      };

      this.setMGlpStakingObj(stakeObject);
      this.setLoadingMGlpStake(false);
    },

    // async getUserLocked(contractInstance) {
    //   try {
    //     const infoResp = await contractInstance.users(this.account, {
    //       gasLimit: 1000000,
    //     });

    //     const lockTimestamp = infoResp.lockedUntil.toString();
    //     const currentTimestamp = moment().unix().toString();

    //     if (+lockTimestamp > 0 && lockTimestamp > currentTimestamp)
    //       return lockTimestamp;
    //     return false;
    //   } catch (e) {
    //     console.log("isApprowed err:", e);
    //     return false;
    //   }
    // },

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
