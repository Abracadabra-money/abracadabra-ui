import oracleAbi from "@/utils/abi/oracle";
import { mapGetters, mapMutations } from "vuex";
import tokensAbi from "@/utils/abi/tokensAbi/index";
import poolsAbi from "@/utils/abi/borrowPoolsAbi/index";
import { isTokenApprowed } from "@/utils/approveHelpers";
import degenBoxERC4626WrapperAbi from "@/utils/abi/DegenBoxERC4626Wrapper";
import degenBoxAbi from "@/utils/abi/degenBox";

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
        cauldronAddress: "0x726413d7402fF180609d0EBc79506df8633701B1",
        wrapperAddress: "0x72dB7051a79260F65a2aFF5Bdb5B658C29E5760d",
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

      const { mainToken, stakeToken, oracle, wrapperAddress, cauldronAddress } =
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

      const cauldronContract = await new this.$ethers.Contract(
        cauldronAddress,
        JSON.stringify(poolsAbi.CauldronV4),
        this.userSigner
      );

      const wrapperContract = await new this.$ethers.Contract(
        wrapperAddress,
        JSON.stringify(degenBoxERC4626WrapperAbi),
        this.userSigner
      );

      const degenBoxAddress = await cauldronContract.bentoBox();

      const degenBoxContract = await new this.$ethers.Contract(
        degenBoxAddress,
        JSON.stringify(degenBoxAbi),
        this.userSigner
      );

      const masterContractAddress = await cauldronContract.masterContract();

      if (!this.price) {
        const price = await oracleContract.peekSpot("0x");
        this.price = this.$ethers.utils.formatUnits(price, 18);
      }

      const { mainTokenBalance, stakeTokenBalance, isDegenboxApproved } =
        await this.getUserInfo(
          stakeTokenInstance,
          mainTokenInstance,
          degenBoxAddress
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
        },
        wrapper: {
          address: wrapperAddress,
          contract: wrapperContract,
        },
        degenbox: {
          address: degenBoxAddress,
          contract: degenBoxContract,
          approved: isDegenboxApproved,
        },
        cauldron: {
          address: cauldronAddress,
          contract: cauldronContract,
        },
        masterContractAddress,
      };

      this.setMGlpStakingObj(stakeObject);
      this.setLoadingMGlpStake(false);
    },

    async getUserInfo(stakeInstance, mainInstance, wrapperAddress) {
      let stakeTokenBalance = 0;
      let mainTokenBalance = 0;
      let isDegenboxApproved = false;

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

        isDegenboxApproved = await isTokenApprowed(
          stakeInstance,
          wrapperAddress,
          this.account,
          true
        );
      }

      return { mainTokenBalance, stakeTokenBalance, isDegenboxApproved };
    },
  },
};
