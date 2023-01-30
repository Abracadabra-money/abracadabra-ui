import oracleAbi from "@/utils/abi/oracle";
import { mapGetters, mapMutations } from "vuex";
import tokensAbi from "@/utils/abi/tokensAbi/index";
import { isTokenApprowed } from "@/utils/approveHelpers";
import chainLinkAbi from "@/utils/abi/chainLink";

export default {
  data() {
    return {
      price: null,
      stakeInfo: {
        mainToken: {
          name: "mGLP",
          address: "0x85667409a723684Fe1e57Dd1ABDe8D88C2f54214",
          decimals: 18,
          abi: tokensAbi.magicGLP,
          icon: require("@/assets/images/tokens/mGLP.png"),
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
        ethChainLinkAddress: "0x639fe6ab55c921f74e7fac1ee960c0b6293ba612",
      },
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      provider: "getProvider",
      account: "getAccount",
      signer: "getSigner",
    }),

    userSigner() {
      return this.signer || this.provider;
    },
  },

  methods: {
    ...mapMutations(["setLoadingMGlpStake", "setMGlpStakingObj"]),

    async createStakePool() {
      if (this.chainId !== 42161) return !!this.setLoadingMGlpStake(false);

      const { mainToken, stakeToken, oracle } =
        this.stakeInfo;

      const mainTokenInstance = await new this.$ethers.Contract(
        mainToken.address,
        JSON.stringify(mainToken.abi),
        this.userSigner
      );

      const stakeTokenInstance = await new this.$ethers.Contract(
        stakeToken.address,
        JSON.stringify(stakeToken.abi),
        this.userSigner
      );

      const oracleContract = await new this.$ethers.Contract(
        oracle.address,
        JSON.stringify(oracle.abi),
        this.userSigner
      );

      const ethChainLinkContract = await new this.$ethers.Contract(
        this.stakeInfo.ethChainLinkAddress,
        JSON.stringify(chainLinkAbi),
        this.userSigner
      );

      const ethPriceHex = await ethChainLinkContract.latestAnswer();
      const ethPrice = this.$ethers.utils.formatUnits(ethPriceHex, 8);

      if (!this.price) {
        const price = await oracleContract.peekSpot("0x");
        this.price = this.$ethers.utils.formatUnits(price, 18);
      }

      const {
        mainTokenBalance,
        stakeTokenBalance,
        stakeTokenApproved,
      } = await this.getUserInfo(
        stakeTokenInstance,
        mainTokenInstance
      );

      const mainTokenBalanceUsd = mainTokenBalance * this.price;
      const stakeTokenBalanceUsd = stakeTokenBalance * this.price;
      const totalSupplyHex = await mainTokenInstance.totalSupply();
      const totalSupply = this.$ethers.utils.formatUnits(totalSupplyHex, 18);
      const totalSupplyUsd = totalSupply * this.price;

      const stakeObject = {
        mainToken: {
          ...mainToken,
          contractInstance: mainTokenInstance,
          balance: mainTokenBalance,
          price: this.price,
          balanceUsd: mainTokenBalanceUsd,
          totalSupply,
          totalSupplyUsd,
        },
        stakeToken: {
          ...stakeToken,
          contractInstance: stakeTokenInstance,
          balance: stakeTokenBalance,
          price: this.price,
          balanceUsd: stakeTokenBalanceUsd,
          isApproved: stakeTokenApproved,
        },
        ethPrice,
      };

      this.setMGlpStakingObj(stakeObject);
      this.setLoadingMGlpStake(false);
    },

    async getUserInfo(stakeInstance, mainInstance) {
      let stakeTokenBalance = 0;
      let mainTokenBalance = 0;
      let stakeTokenApproved = false;

      if (this.account) {
        const stakeTokenBalanceHex = await stakeInstance.balanceOf(
          this.account
        );
        stakeTokenBalance = this.$ethers.utils.formatEther(
          stakeTokenBalanceHex.toString()
        );

        const mainTokenBalanceHex = await mainInstance.balanceOf(this.account);
        mainTokenBalance = this.$ethers.utils.formatEther(
          mainTokenBalanceHex.toString()
        );

        stakeTokenApproved = await isTokenApprowed(
          stakeInstance,
          mainInstance.address,
          this.account,
          true
        );
      }

      return {
        mainTokenBalance,
        stakeTokenBalance,
        stakeTokenApproved
      };
    },
  },
};
