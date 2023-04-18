import { markRaw } from "vue";
import oracleAbi from "@/utils/abi/oracle";
import { mapGetters, mapMutations } from "vuex";
import tokensAbi from "@/utils/abi/tokensAbi/index";
import { isTokenApprowed } from "@/utils/approveHelpers";
import chainLinkAbi from "@/utils/abi/chainLink";
import MagicGlpHarvestorAbi from "@/utils/abi/MagicGlpHarvestor";

export default {
  data() {
    return {
      price: null,
      acceptChain: [42161, 43114],
      stakeInfo: {
        42161: {
          harvester: {
            address: "0x588d402C868aDD9053f8F0098c2DC3443c991d17",
            abi: MagicGlpHarvestorAbi,
          },
          mainToken: {
            name: "magicGLP",
            address: "0x85667409a723684Fe1e57Dd1ABDe8D88C2f54214",
            decimals: 18,
            abi: tokensAbi.magicGLP,
            icon: this.$image("assets/images/tokens/mGlpToken.png"),
          },
          stakeToken: {
            name: "GLP",
            address: "0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf",
            decimals: 18,
            abi: tokensAbi.sGLP,
            icon: this.$image(`assets/images/tokens/GLP.png`),
          },
          oracle: {
            address: "0x4ED0935ecC03D7FcEfb059e279BCD910a02F284C",
            abi: oracleAbi,
          },
          chainLinkAddress: "0x639fe6ab55c921f74e7fac1ee960c0b6293ba612",
        },
        43114: {
          harvester: {
            address: "0x05b3b96df07b4630373ae7506e51777b547335b0",
            abi: MagicGlpHarvestorAbi,
          },
          mainToken: {
            name: "magicGLP",
            address: "0x5EFC10C353FA30C5758037fdF0A233e971ECc2e0",
            decimals: 18,
            abi: tokensAbi.magicGLP,
            icon: this.$image("assets/images/tokens/mGlpToken.png"),
          },
          stakeToken: {
            name: "GLP",
            address: "0xae64d55a6f09e4263421737397d1fdfa71896a69",
            decimals: 18,
            abi: tokensAbi.sGLP,
            icon: this.$image(`assets/images/tokens/GLP.png`),
          },
          oracle: {
            address: "0x3Cc89EA432c36c8F96731765997722192202459D",
            abi: oracleAbi,
          },
          chainLinkAddress: "0x0a77230d17318075983913bc2145db16c7366156",
        },
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
      if (!this.acceptChain.includes(this.chainId))
        return !!this.setLoadingMGlpStake(false);

      const { mainToken, stakeToken, oracle, harvester, chainLinkAddress } =
        this.stakeInfo[this.chainId];

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

      const tokensRate = await this.getTokensRate(
        mainTokenInstance,
        stakeTokenInstance
      );

      const harvesterInstance = await new this.$ethers.Contract(
        harvester.address,
        JSON.stringify(harvester.abi),
        this.userSigner
      );

      const feePercent = (await harvesterInstance.feePercentBips()) / 10000; // to percent

      const oracleContract = await new this.$ethers.Contract(
        oracle.address,
        JSON.stringify(oracle.abi),
        this.userSigner
      );

      const chainLinkContract = await new this.$ethers.Contract(
        chainLinkAddress,
        JSON.stringify(chainLinkAbi),
        this.userSigner
      );

      const rewardsTokenPriceHex = await chainLinkContract.latestAnswer();
      const rewardsTokenPrice = this.$ethers.utils.formatUnits(
        rewardsTokenPriceHex,
        8
      );

      if (!this.price) {
        const price = await oracleContract.peekSpot("0x");
        this.price = 1 / this.$ethers.utils.formatUnits(price, 18);
      }

      const { mainTokenBalance, stakeTokenBalance, stakeTokenApproved } =
        await this.getUserInfo(stakeTokenInstance, mainTokenInstance);

      const stakeTokenPrice = this.price / tokensRate;

      const mainTokenBalanceUsd = mainTokenBalance * this.price;
      const stakeTokenBalanceUsd = stakeTokenBalance * stakeTokenPrice;
      const totalSupplyHex = await mainTokenInstance.totalSupply();
      const totalSupply = this.$ethers.utils.formatUnits(totalSupplyHex, 18);
      const totalSupplyUsd = totalSupply * this.price;

      const stakeObject = {
        tokensRate,
        feePercent,
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
          price: stakeTokenPrice,
          balanceUsd: stakeTokenBalanceUsd,
          isApproved: stakeTokenApproved,
        },
        rewardsTokenPrice,
      };

      this.setMGlpStakingObj(markRaw(stakeObject));
      this.setLoadingMGlpStake(false);
    },

    async getTokensRate(mainTokenInstance, stakeTokenInstance) {
      const mGlpBalance = await stakeTokenInstance.balanceOf(
        mainTokenInstance.address
      );
      const totalSupply = await mainTokenInstance.totalSupply();

      const parsedBalance = this.$ethers.utils.formatEther(
        mGlpBalance.toString()
      );
      const parsedTotalSupply = this.$ethers.utils.formatEther(totalSupply);

      const tokenRate = parsedBalance / parsedTotalSupply;

      return tokenRate;
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
        stakeTokenApproved,
      };
    },
  },
};
